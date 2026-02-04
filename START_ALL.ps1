# 🚀 CareerNexus Quick Start - PowerShell Script
# Run this to start everything automatically!

# Check if running as admin (needed for MongoDB service)
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 CareerNexus - Quick Start" -ForegroundColor Green
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check MongoDB
Write-Host "[1/3] Checking MongoDB Service..." -ForegroundColor Yellow
$mongoStatus = Get-Service MongoDB -ErrorAction SilentlyContinue

if ($mongoStatus -eq $null) {
    Write-Host "⚠️  MongoDB not installed" -ForegroundColor Red
    Write-Host "   Download: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Write-Host "   OR use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas" -ForegroundColor Yellow
} elseif ($mongoStatus.Status -eq "Running") {
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB is stopped. Starting..." -ForegroundColor Yellow
    if ($isAdmin) {
        Start-Service MongoDB
        Write-Host "✅ MongoDB started" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Need admin rights to start MongoDB" -ForegroundColor Red
        Write-Host "   Please run PowerShell as Administrator" -ForegroundColor Red
    }
}

Write-Host ""

# Step 2: Start Backend
Write-Host "[2/3] Starting Backend Server..." -ForegroundColor Yellow
Write-Host "      Opening new terminal..." -ForegroundColor Cyan

$backendPath = Join-Path $PSScriptRoot "backend"
$backendCommand = "cd '$backendPath'; npm start"

# Create backend terminal
$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = "powershell.exe"
$processInfo.Arguments = "-NoExit", "-Command", $backendCommand
$processInfo.WindowStyle = "Normal"
$process = [System.Diagnostics.Process]::Start($processInfo)

Write-Host "✅ Backend terminal opened" -ForegroundColor Green
Write-Host "   Waiting 5 seconds for backend to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host ""

# Step 3: Start Expo
Write-Host "[3/3] Starting Expo Development Server..." -ForegroundColor Yellow
Write-Host "      Opening new terminal..." -ForegroundColor Cyan

$expoPath = $PSScriptRoot
$expoCommand = "cd '$expoPath'; npx expo start"

$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = "powershell.exe"
$processInfo.Arguments = "-NoExit", "-Command", $expoCommand
$processInfo.WindowStyle = "Normal"
$process = [System.Diagnostics.Process]::Start($processInfo)

Write-Host "✅ Expo terminal opened" -ForegroundColor Green

Write-Host ""
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ All services started!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "📱 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "   1. In Expo terminal, press 'w' for web version" -ForegroundColor Cyan
Write-Host "   2. Or scan QR code with Expo Go app" -ForegroundColor Cyan
Write-Host "   3. Register with test account:" -ForegroundColor Cyan
Write-Host "      - Email: test@example.com" -ForegroundColor Gray
Write-Host "      - Password: 123456" -ForegroundColor Gray
Write-Host ""

Write-Host "🔗 API HEALTH CHECK:" -ForegroundColor Yellow
Write-Host "   http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  IMPORTANT:" -ForegroundColor Red
Write-Host "   ✓ Keep both terminals OPEN" -ForegroundColor Yellow
Write-Host "   ✓ Close = app stops working" -ForegroundColor Yellow
Write-Host "   ✓ Check backend console for errors" -ForegroundColor Yellow
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
