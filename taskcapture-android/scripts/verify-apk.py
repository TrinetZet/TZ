#!/usr/bin/env python3
import sys,json,pathlib,hashlib,zipfile,subprocess
def verify(path):
 lock=json.loads((pathlib.Path(__file__).resolve().parents[1]/'dependencies.lock.json').read_text())
 with zipfile.ZipFile(path) as apk:
  names=apk.namelist()
  if 'assets/model.gguf' not in names:raise ValueError('Bundled model missing')
  if 'lib/arm64-v8a/libtaskcapture.so' not in names:raise ValueError('arm64 inference runtime missing')
  with apk.open('assets/model.gguf') as f:
   h=hashlib.file_digest(f,'sha256').hexdigest()
  if h!=lock['model_sha256']:raise ValueError('Model SHA-256 mismatch')
  for name in ['assets/llama-LICENSE.txt','assets/Qwen-LICENSE.txt','assets/model-info.json']:
   if name not in names:raise ValueError('License or pinned metadata missing')
 return {'apk_bytes':pathlib.Path(path).stat().st_size,'model_sha256':h,'abi':'arm64-v8a'}
if __name__=='__main__':
 report=verify(sys.argv[1])
 aapt=sys.argv[2];signer=sys.argv[3]
 xml=subprocess.check_output([aapt,'dump','xmltree',sys.argv[1],'AndroidManifest.xml'],text=True)
 if 'android.permission.INTERNET' in xml:raise ValueError('INTERNET permission detected')
 if 'com.trinetzet.taskcapture' not in xml:raise ValueError('Wrong application id')
 if not any('allowBackup' in line and '0x0' in line for line in xml.splitlines()):raise ValueError('Backup not disabled')
 subprocess.run([signer,'verify','--verbose',sys.argv[1]],check=True)
 print(json.dumps(report))
