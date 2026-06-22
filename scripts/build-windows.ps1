param(
    [switch]$Developer
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$cargoBin = Join-Path $env:USERPROFILE ".cargo\bin"
$env:Path = "$cargoBin;$env:Path"

if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    throw "Rust/Cargo est absent. Installez Rust avec : winget install Rustlang.Rustup"
}

Set-Location -LiteralPath $root
$env:VITE_PUBLIC_BUILD = if ($Developer) { "false" } else { "true" }
pnpm desktop:build
if ($LASTEXITCODE -ne 0) {
    throw "La compilation Tauri a échoué."
}

$target = Join-Path $root "apps\desktop\src-tauri\target\release"
$installer = Get-ChildItem -LiteralPath (Join-Path $target "bundle\nsis") -Filter "*-setup.exe" |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if (-not $installer) {
    throw "Installateur NSIS introuvable après compilation."
}

$artifacts = Join-Path $root "artifacts"
New-Item -ItemType Directory -Force -Path $artifacts | Out-Null
Copy-Item -Force -LiteralPath $installer.FullName -Destination (Join-Path $artifacts "OstiroAtlas-Setup.exe")
Copy-Item -Force -LiteralPath (Join-Path $target "ostiro-atlas.exe") -Destination (Join-Path $artifacts "OstiroAtlas-Portable.exe")

$hash = Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $artifacts "OstiroAtlas-Setup.exe")
$hash.Hash | Set-Content -Encoding ASCII -LiteralPath (Join-Path $artifacts "OstiroAtlas-Setup.exe.sha256")

Write-Host ""
Write-Host "Installateur prêt :" -ForegroundColor Green
Write-Host (Join-Path $artifacts "OstiroAtlas-Setup.exe")
Write-Host ""
Write-Host "Double-cliquez dessus pour installer ou mettre à jour Ostiro Atlas."
