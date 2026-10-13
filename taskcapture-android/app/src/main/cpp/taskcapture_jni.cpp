#include "engine.h"
#include <jni.h>
#include <exception>
#include <stdexcept>
#include <string>
static std::string bytes(JNIEnv *env,jbyteArray value) {
 if(!value)throw std::runtime_error("null_input");
 jsize len=env->GetArrayLength(value);std::string s(len,'\0');
 env->GetByteArrayRegion(value,0,len,reinterpret_cast<jbyte *>(s.data()));return s;
}
extern "C" JNIEXPORT jbyteArray JNICALL
Java_com_trinetzet_taskcapture_NativeModel_run(JNIEnv *env,jclass,jbyteArray path,jbyteArray prompt) {
 try {auto result=extract_task(bytes(env,path),bytes(env,prompt));
  auto arr=env->NewByteArray(result.size());if(arr)env->SetByteArrayRegion(arr,0,result.size(),reinterpret_cast<const jbyte *>(result.data()));return arr;
 } catch(const std::exception &e) {env->ThrowNew(env->FindClass("java/lang/IllegalStateException"),e.what());return nullptr;}
}
