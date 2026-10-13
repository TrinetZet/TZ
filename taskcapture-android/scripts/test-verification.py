import unittest,importlib.util,tempfile,zipfile,pathlib
spec=importlib.util.spec_from_file_location('verify',pathlib.Path(__file__).with_name('verify-apk.py'))
mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
class VerificationTest(unittest.TestCase):
 def test_exact_package_and_version(self):
  xml='A: package="com.trinetzet.taskcapture.glass" (Raw: "com.trinetzet.taskcapture.glass")\nA: android:versionName(0x0101021c)="0.2.0" (Raw: "0.2.0")\nA: android:versionCode(0x0101021b)=(type 0x10)0x2\nA: android:allowBackup(0x01010280)=(type 0x12)0x0'
  self.assertEqual(mod.verify_manifest(xml)['package'],'com.trinetzet.taskcapture.glass')
  with self.assertRaises(ValueError):mod.verify_manifest(xml.replace('com.trinetzet.taskcapture.glass','com.trinetzet.taskcapture'))
  with self.assertRaises(ValueError):mod.verify_manifest(xml.replace('0.2.0','0.1.0'))
  with self.assertRaises(ValueError):mod.verify_manifest(xml+'\nandroid.permission.INTERNET')
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
