import unittest,subprocess,pathlib
root=pathlib.Path(__file__).resolve().parents[2]
class BuildFilesTest(unittest.TestCase):
 def test_visual_evidence_is_uploaded(self):
  workflow=(root/'.github/workflows/taskcapture-android.yml').read_text()
  self.assertIn('taskcapture-android/ui-artifacts/**',workflow)
  self.assertIn('taskcapture-android/visual-test.log',workflow)
 def test_emulator_script_is_committed(self):
  p='taskcapture-android/scripts/emulator-check.sh'
  tracked=subprocess.run(['git','ls-files','--error-unmatch',p],cwd=root,capture_output=True)
  self.assertEqual(tracked.returncode,0,tracked.stderr.decode())
 def test_license_is_committed(self):
  p='taskcapture-android/app/src/main/assets/Qwen-LICENSE.txt'
  self.assertTrue((root/p).exists(),'Pinned license missing')
if __name__=='__main__':unittest.main()
