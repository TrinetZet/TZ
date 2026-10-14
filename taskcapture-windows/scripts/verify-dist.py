import hashlib,json,pathlib,sys
MODEL_HASH='ac2d97712095a558e31573f62f466a3f9d93990898b0ec79d7c974c1780d524a'
def verify(root):
 root=pathlib.Path(root)
 for name in ['TaskCapture.Windows.exe','TaskCapture.Windows.dll','TaskCapture.Windows.runtimeconfig.json','runtime/taskcapture-worker.exe','runtime/model.gguf','runtime/Qwen-LICENSE.txt','runtime/llama-LICENSE.txt']:
  p=root/name
  if not p.is_file() or p.stat().st_size==0:raise ValueError('Missing packaged file: '+name)
 model=root/'runtime/model.gguf'
 with model.open('rb') as f:digest=hashlib.file_digest(f,'sha256').hexdigest()
 if model.stat().st_size!=396705472 or digest!=MODEL_HASH:raise ValueError('Pinned model hash mismatch')
 for name in ['TaskCapture.Windows.exe','runtime/taskcapture-worker.exe']:
  with (root/name).open('rb') as f:
   if f.read(2)!=b'MZ':raise ValueError('Invalid Windows executable: '+name)
 config=json.loads((root/'TaskCapture.Windows.runtimeconfig.json').read_text())
 if not config.get('runtimeOptions',{}).get('includedFrameworks'):raise ValueError('Runtime is not self-contained')
 files={}
 for p in sorted(root.rglob('*')):
  if p.is_file():
   with p.open('rb') as f:files[p.relative_to(root).as_posix()]={'bytes':p.stat().st_size,'sha256':hashlib.file_digest(f,'sha256').hexdigest()}
 return {'product':'TaskCapture Glass Windows','version':'0.1.0','platform':'win-x64','model_sha256':digest,'files':files,'signing':'unsigned'}
if __name__=='__main__':
 try:print(json.dumps(verify(sys.argv[1]),ensure_ascii=False,indent=2))
 except Exception as e:print(str(e),file=sys.stderr);sys.exit(1)
