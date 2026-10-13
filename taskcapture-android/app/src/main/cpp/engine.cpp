#include "engine.h"
#include "deadline.h"
#include "thread_config.h"
#include <thread>
#include "llama.h"
#include <memory>
#include <mutex>
#include <stdexcept>
#include <vector>
#include <chrono>
namespace {
void silent_log(enum ggml_log_level,const char *,void *) {}
bool timed_out(void *data){return static_cast<Deadline *>(data)->expired();}
bool loading_allowed(float,void *data){return !timed_out(data);}
const char *grammar=R"GBNF(
root ::= "{\"title\":" ws string ",\"description\":" ws string "}" ws
string ::= "\"" char+ "\""
char ::= [^"\\\x00-\x1F] | "\\" (["\\/bfnrt] | "u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F])
ws ::= [ \t\n\r]*
)GBNF";
}
std::string extract_task(const std::string &path,const std::string &prompt) {
 static std::once_flag once;
 std::call_once(once,[]{llama_log_set(silent_log,nullptr);llama_backend_init();});
 Deadline deadline;
 auto mp=llama_model_default_params();mp.progress_callback=loading_allowed;mp.progress_callback_user_data=&deadline;mp.n_gpu_layers=0;mp.load_mode=LLAMA_LOAD_MODE_MMAP;
 std::unique_ptr<llama_model,decltype(&llama_model_free)> model(llama_model_load_from_file(path.c_str(),mp),llama_model_free);
 if(!model)throw std::runtime_error("model_load");
 auto cp=llama_context_default_params();cp.n_ctx=2048;cp.n_batch=2048;cp.n_ubatch=128;cp.n_threads=inference_threads(std::thread::hardware_concurrency());cp.n_threads_batch=cp.n_threads;cp.abort_callback=timed_out;cp.abort_callback_data=&deadline;
 std::unique_ptr<llama_context,decltype(&llama_free)> ctx(llama_init_from_model(model.get(),cp),llama_free);
 if(!ctx)throw std::runtime_error("context_load");
 auto vocab=llama_model_get_vocab(model.get());
 int n=llama_tokenize(vocab,prompt.data(),(int)prompt.size(),nullptr,0,true,true);
 if(n>=0)throw std::runtime_error("tokenize");
 std::vector<llama_token> tokens(-n);
 n=llama_tokenize(vocab,prompt.data(),(int)prompt.size(),tokens.data(),(int)tokens.size(),true,true);
 if(n<=0||n>1700)throw std::runtime_error("input_context");
 tokens.resize(n);
 if(llama_decode(ctx.get(),llama_batch_get_one(tokens.data(),n)))throw std::runtime_error("prompt_decode");
 std::unique_ptr<llama_sampler,decltype(&llama_sampler_free)> sampler(llama_sampler_chain_init(llama_sampler_chain_default_params()),llama_sampler_free);
 auto g=llama_sampler_init_grammar(vocab,grammar,"root");
 if(!g)throw std::runtime_error("grammar");
 llama_sampler_chain_add(sampler.get(),g);
 llama_sampler_chain_add(sampler.get(),llama_sampler_init_top_k(20));
 llama_sampler_chain_add(sampler.get(),llama_sampler_init_top_p(0.95f,1));
 llama_sampler_chain_add(sampler.get(),llama_sampler_init_temp(0.6f));
 llama_sampler_chain_add(sampler.get(),llama_sampler_init_dist(73));
 std::string out;
 for(int i=0;i<256;i++) {
  if(deadline.expired())throw std::runtime_error("timeout");
  llama_token token=llama_sampler_sample(sampler.get(),ctx.get(),-1);
  if(llama_vocab_is_eog(vocab,token))return out;
  char buf[256];int size=llama_token_to_piece(vocab,token,buf,sizeof(buf),0,false);
  if(size<0) {std::vector<char> large(-size);size=llama_token_to_piece(vocab,token,large.data(),large.size(),0,false);if(size<0)throw std::runtime_error("token_piece");out.append(large.data(),size);}
  else out.append(buf,size);
  if(out.size()>16384)throw std::runtime_error("output_size");
  if(llama_decode(ctx.get(),llama_batch_get_one(&token,1)))throw std::runtime_error("token_decode");
 }
 throw std::runtime_error("output_limit");
}
