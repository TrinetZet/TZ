import tempfile,pathlib,unittest,importlib.util,json
spec=importlib.util.spec_from_file_location('verify',pathlib.Path(__file__).with_name('verify-dist.py'));module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
class VerifyTests(unittest.TestCase):
 def test_missing_worker_is_rejected(self):
  with tempfile.TemporaryDirectory() as directory:
   with self.assertRaisesRegex(ValueError,'Missing packaged file'):module.verify(directory)
 def test_changed_model_is_rejected(self):
  with tempfile.TemporaryDirectory() as directory:
   root=pathlib.Path(directory)
   for name in ['TaskCapture.Windows.exe','TaskCapture.Windows.dll','TaskCapture.Windows.runtimeconfig.json','runtime/taskcapture-worker.exe','runtime/model.gguf','runtime/Qwen-LICENSE.txt','runtime/llama-LICENSE.txt']:
    p=root/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b'MZ-not-model')
   with self.assertRaisesRegex(ValueError,'Pinned model hash mismatch'):module.verify(root)
if __name__=='__main__':unittest.main()
