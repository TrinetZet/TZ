import unittest,importlib.util,tempfile,zipfile,pathlib
spec=importlib.util.spec_from_file_location('verify',pathlib.Path(__file__).with_name('verify-apk.py'))
mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
class VerificationTest(unittest.TestCase):
 def test_missing_model_rejected(self):
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d)/'fake.apk'
   with zipfile.ZipFile(p,'w') as z:z.writestr('AndroidManifest.xml','fake')
   with self.assertRaisesRegex(ValueError,'Bundled model missing'):mod.verify(p)
 def test_missing_arm_runtime_rejected(self):
  with tempfile.TemporaryDirectory() as d:
   p=pathlib.Path(d)/'fake.apk'
   with zipfile.ZipFile(p,'w') as z:z.writestr('assets/model.gguf','fake')
   with self.assertRaisesRegex(ValueError,'arm64'):mod.verify(p)
if __name__=='__main__':unittest.main()
