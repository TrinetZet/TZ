[Setup]
AppId={{2DCE8AB7-C704-40E7-9E5C-7A8E42B26CF6}
AppName=TaskCapture Glass
AppVersion=0.1.0
AppPublisher=TrinetZet
AppPublisherURL=https://github.com/TrinetZet/TZ
DefaultDirName={localappdata}\Programs\TaskCaptureGlass
DefaultGroupName=TaskCapture Glass
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
OutputDir=distribution
OutputBaseFilename=TaskCaptureGlassSetup-0.1.0-win-x64
SetupIconFile=App\App.ico
UninstallDisplayIcon={app}\TaskCapture.Windows.exe
Compression=lzma2/fast
SolidCompression=yes
WizardStyle=modern
CloseApplications=yes
[Files]
Source: "distribution\portable\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
[Icons]
Name: "{group}\TaskCapture Glass"; Filename: "{app}\TaskCapture.Windows.exe"
Name: "{userdesktop}\TaskCapture Glass"; Filename: "{app}\TaskCapture.Windows.exe"; Tasks: desktopicon
[Tasks]
Name: "desktopicon"; Description: "Создать ярлык на рабочем столе"; Flags: unchecked
[Run]
Filename: "{app}\TaskCapture.Windows.exe"; Description: "Запустить TaskCapture Glass"; Flags: nowait postinstall skipifsilent
[Code]
procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
var Value: String;
begin
 if CurUninstallStep = usPostUninstall then
  if RegQueryStringValue(HKCU, 'Software\Microsoft\Windows\CurrentVersion\Run', 'TaskCaptureGlass', Value) then
   if Pos(Lowercase(ExpandConstant('{app}')), Lowercase(Value)) > 0 then
    RegDeleteValue(HKCU, 'Software\Microsoft\Windows\CurrentVersion\Run', 'TaskCaptureGlass');
end;
