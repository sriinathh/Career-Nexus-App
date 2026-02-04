🔴 REGISTRATION/LOGIN NOT WORKING?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ QUICK SOLUTION (Do This Now):

1️⃣  Open PowerShell (Win + R → powershell → Enter)

2️⃣  Start MongoDB (if using local):
   Get-Service MongoDB | Select-Object Status
   # If "Stopped": Start-Service MongoDB

3️⃣  Start Backend (Terminal 1):
   cd C:\Users\srinath\Downloads\NRCM\mobile-app\backend
   npm start
   # Wait for: ✅ Connected to MongoDB

4️⃣  Start Expo (Terminal 2):
   cd C:\Users\srinath\Downloads\NRCM\mobile-app
   npx expo start
   # Press 'w' for web OR scan QR with Expo Go

5️⃣  Test - Try registering in app:
   ✅ Should work and redirect to Dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If Still Broken:

❌ "Backend not running" error?
   → Make sure Terminal 1 shows: "Server is running on http://localhost:5000"

❌ MongoDB "connection failed"?
   → Option A: Start MongoDB service
   → Option B: Use MongoDB Atlas (cloud, easier)
      1. Go to https://www.mongodb.com/cloud/atlas
      2. Sign up
      3. Create cluster
      4. Get connection string
      5. Update backend/.env with that string

❌ Still broken?
   → Check if API responds:
      curl http://localhost:5000/api/health
   → Should return: {"status":"Server is running"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Files Created for You:

✓ START_ALL.ps1       - Auto-start all services (PowerShell)
✓ START_APP.bat       - Auto-start on Windows (batch)
✓ TEST_BACKEND.bat    - Test if backend is running
✓ QUICK_FIX.md        - This quick fix guide
✓ SETUP_GUIDE.md      - Complete setup & troubleshooting
✓ MONGODB_SETUP.md    - How to set up MongoDB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Key Points:

1. Backend MUST be running (Terminal 1)
2. MongoDB MUST be connected (local or Atlas)
3. Expo MUST be running (Terminal 2)
4. API_URL in Login.jsx is correct (10.0.2.2:5000 for emulator)
5. Keep both terminals OPEN while testing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Need More Help? Check:

📄 QUICK_FIX.md        ← Read first (2 min)
📄 SETUP_GUIDE.md      ← Detailed guide (10 min)
📄 MONGODB_SETUP.md    ← Database setup (5 min)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
