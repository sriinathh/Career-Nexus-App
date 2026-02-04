@echo off
REM CareerNexus AI - Complete Startup Script
REM This script starts MongoDB, Backend Server, and Expo

echo.
echo ====================================================
echo  🚀 CareerNexus AI - Complete Startup
echo ====================================================
echo.

REM Check if MongoDB is running
echo [1/3] Checking MongoDB Service...
tasklist | find /i "mongod.exe" > nul
if errorlevel 1 (
    echo ⚠️  MongoDB not running. Please start it:
    echo    - Download from: https://www.mongodb.com/try/download/community
    echo    - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
    echo    - Update MONGODB_URI in backend\.env if using MongoDB Atlas
    echo.
    pause
) else (
    echo ✅ MongoDB is running
)

echo.
echo [2/3] Starting Backend Server...
cd /d "%~dp0backend"
start "CareerNexus Backend" cmd /k npm start
echo ✅ Backend started on http://localhost:5000
echo.

timeout /t 3 /nobreak

echo [3/3] Starting Expo Development Server...
cd /d "%~dp0"
start "CareerNexus Expo" cmd /k npx expo start
echo ✅ Expo started
echo.

echo ====================================================
echo  ✅ All services started!
echo ====================================================
echo.
echo 📱 TO USE THE APP:
echo    1. Scan QR code with Expo Go app (Android/iOS)
echo    2. Or press 'w' for web version
echo    3. Or press 'a' for Android emulator
echo.
echo 🔗 Backend Health Check:
echo    http://localhost:5000/api/health
echo.
echo 📊 MongoDB Atlas Alternative:
echo    If using MongoDB Atlas, update .env with your connection string:
echo    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careernexus
echo.
pause
