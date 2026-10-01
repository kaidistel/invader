$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$running = $false
try { $response = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4173/' -TimeoutSec 2; $running = $response.Content.Contains('NIGHTFLY') } catch {}
if (-not $running) {
 $nodePath = (Get-Command node.exe -ErrorAction Stop).Source
 Start-Process -FilePath $nodePath -ArgumentList 'server.mjs' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
 for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Milliseconds 200
  try { $response = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4173/' -TimeoutSec 1; if ($response.Content.Contains('NIGHTFLY')) { $running = $true; break } } catch {}
 }
}
if (-not $running) { throw 'Die Simulation konnte nicht auf Port 4173 gestartet werden.' }
Start-Process 'http://127.0.0.1:4173/'
