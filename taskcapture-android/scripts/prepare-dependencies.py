#!/usr/bin/env python3
import hashlib,json,pathlib,subprocess,urllib.request,time,shutil
root=pathlib.Path(__file__).resolve().parents[1]
lock=json.loads((root/'dependencies.lock.json').read_text())
llama=root/'third_party/llama.cpp'
llama.parent.mkdir(parents=True,exist_ok=True)
if not (llama/'.git').exists():
 subprocess.run(['git','init',str(llama)],check=True)
 subprocess.run(['git','-C',str(llama),'remote','add','origin','https://github.com/ggml-org/llama.cpp.git'],check=True)
if subprocess.run(['git','-C',str(llama),'cat-file','-e',lock['llama_commit']],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode:
 subprocess.run(['git','-C',str(llama),'fetch','--depth=1','origin',lock['llama_commit']],check=True)
subprocess.run(['git','-C',str(llama),'checkout','--detach',lock['llama_commit']],check=True)
assets=root/'app/src/main/assets';assets.mkdir(parents=True,exist_ok=True)
model=assets/'model.gguf'
def valid(p):
 if not p.exists() or p.stat().st_size!=lock['model_size']:return False
 with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()==lock['model_sha256']
if not valid(model):
 url=f"https://huggingface.co/{lock['model_repository']}/resolve/{lock['model_revision']}/{lock['model_filename']}?download=true"
 temp=model.with_suffix('.partial')
 for attempt in range(3):
  try:
   with urllib.request.urlopen(url,timeout=120) as source,temp.open('wb') as out:shutil.copyfileobj(source,out,1024*1024)
   if not valid(temp):raise RuntimeError('Model size or SHA-256 mismatch')
   temp.replace(model);break
  except Exception:
   temp.unlink(missing_ok=True)
   if attempt==2:raise
   time.sleep(3)
shutil.copyfile(llama/'LICENSE',assets/'llama-LICENSE.txt')
with urllib.request.urlopen('https://raw.githubusercontent.com/QwenLM/Qwen3/main/LICENSE',timeout=60) as f:
 (assets/'Qwen-LICENSE.txt').write_bytes(f.read())
(assets/'model-info.json').write_text(json.dumps(lock,indent=2))
print(json.dumps({'model_size':model.stat().st_size,'model_sha256':lock['model_sha256'],'llama_commit':lock['llama_commit']}))
