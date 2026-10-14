$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
Set-Location (Join-Path $PSScriptRoot '..')
New-Item -ItemType Directory -Force distribution | Out-Null
dotnet publish App/TaskCapture.Windows.csproj -c Release -r win-x64 --self-contained true -o distribution/portable
New-Item -ItemType Directory -Force distribution/portable/runtime | Out-Null
Copy-Item ../native-artifact/* distribution/portable/runtime/ -Recurse
python scripts/test-verification.py
python scripts/verify-dist.py distribution/portable | Set-Content -Encoding utf8NoBOM distribution/verification.json
$compiler = 'C:\Program Files (x86)\Inno Setup 6\ISCC.exe'
if (!(Test-Path $compiler)) { throw 'Inno Setup compiler missing' }
& $compiler installer.iss
Compress-Archive -Path distribution/portable/* -DestinationPath distribution/TaskCaptureGlass-0.1.0-win-x64.zip -CompressionLevel Fastest -Force
$files = @('TaskCaptureGlassSetup-0.1.0-win-x64.exe','TaskCaptureGlass-0.1.0-win-x64.zip')
$lines = foreach ($name in $files) { $hash = Get-FileHash (Join-Path distribution $name) -Algorithm SHA256; $hash.Hash.ToLowerInvariant() + '  ' + $name }
$lines | Set-Content -Encoding utf8NoBOM distribution/SHA256SUMS.txt
