#!/usr/bin/env python3
import sys,json,pathlib,hashlib,zipfile,subprocess,re
def verify_manifest(xml):
 if 'android.permission.INTERNET' in xml:raise ValueError('INTERNET permission detected')
 package=re.search(r'A: package="([^"]+)"',xml)
 if not package or package.group(1)!='com.trinetzet.taskcapture.glass':raise ValueError('Wrong application id')
 if not re.search(r'versionName[^\n]*="0\.2\.0"',xml):raise ValueError('Wrong version name')
 if not re.search(r'versionCode[^\n]*\)0x2(?:\s|$)',xml):raise ValueError('Wrong version code')
 if not re.search(r'allowBackup[^\n]*\)0x0(?:\s|$)',xml):raise ValueError('Backup not disabled')
 return {'package':package.group(1),'version':'0.2.0','version_code':2}
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
 report.update(verify_manifest(xml))
 certificate=subprocess.check_output([signer,'verify','--verbose','--print-certs',sys.argv[1]],text=True,stderr=subprocess.STDOUT)
 digest=re.search(r'certificate SHA-256 digest: ([0-9a-fA-F]{64})',certificate)
 if not digest:raise ValueError('Signing certificate digest missing')
 report['certificate_sha256']=digest.group(1).lower()
 print(json.dumps(report))
