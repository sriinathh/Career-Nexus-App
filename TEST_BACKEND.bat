@echo off
REM Test Backend Connection Script

echo ====================================================
echo  🧪 CareerNexus Backend - Connection Test
echo ====================================================
echo.

REM Check if backend is running on port 5000
echo Testing http://localhost:5000/api/health...
echo.

REM Using curl to test
curl -s http://localhost:5000/api/health >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Backend is RUNNING!
    echo.
    echo Server Response:
    curl -s http://localhost:5000/api/health
    echo.
    echo.
    echo ✅ Database Connection: Check backend console for MongoDB status
) else (
    echo ❌ Backend is NOT RUNNING
    echo.
    echo TROUBLESHOOTING STEPS:
    echo 1. Start backend server first:
    echo    cd backend
    echo    npm start
    echo.
    echo 2. Make sure MongoDB is running:
    echo    - Local: Start MongoDB service
    echo    - Cloud: Use MongoDB Atlas
    echo.
    echo 3. Check backend/.env for correct MONGODB_URI
    echo.
    echo 4. Verify port 5000 is not blocked by firewall
)

echo.
echo ====================================================
pause
