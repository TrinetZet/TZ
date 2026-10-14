$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')
$root = Join-Path $env:TEMP ('TaskCaptureInstall-' + [guid]::NewGuid())
$tasks = Join-Path $env:TEMP ('Tasks-' + [guid]::NewGuid() + '.md')
dotnet run --project Windows.Tests -c Release -- --fixture $tasks
if ($LASTEXITCODE -ne 0) { throw 'Fixture failed' }
$text = [IO.File]::ReadAllText($tasks)
$setup = (Resolve-Path distribution/TaskCaptureGlassSetup-0.1.0-win-x64.exe).Path
$process = Start-Process $setup -ArgumentList @('/VERYSILENT','/SUPPRESSMSGBOXES','/NORESTART',('/DIR="' + $root + '"')) -Wait -PassThru
if ($process.ExitCode -ne 0) { throw "Installer failed: $($process.ExitCode)" }
if (!(Test-Path (Join-Path $root 'TaskCapture.Windows.exe')) -or !(Test-Path (Join-Path $root 'runtime/model.gguf'))) { throw 'Installed runtime incomplete' }
$hash = (Get-FileHash (Join-Path $root 'runtime/model.gguf') -Algorithm SHA256).Hash.ToLowerInvariant()
if ($hash -ne 'ac2d97712095a558e31573f62f466a3f9d93990898b0ec79d7c974c1780d524a') { throw 'Installed model hash mismatch' }
$application = Start-Process (Join-Path $root 'TaskCapture.Windows.exe') -ArgumentList '--background' -PassThru
Start-Sleep -Seconds 2
if ($application.HasExited) { throw 'Installed application failed at startup' }
Stop-Process -Id $application.Id
$process = Start-Process (Join-Path $root 'unins000.exe') -ArgumentList @('/VERYSILENT','/SUPPRESSMSGBOXES','/NORESTART') -Wait -PassThru
if ($process.ExitCode -ne 0) { throw 'Uninstaller failed' }
if ([IO.File]::ReadAllText($tasks) -ne $text) { throw 'Uninstall modified user task file' }
New-Item -ItemType Directory -Force qa-artifacts | Out-Null
'Current-user install/uninstall verified; model hash correct; user MD retained' | Set-Content qa-artifacts/installer.txt
Remove-Item $tasks
