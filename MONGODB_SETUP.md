# 🗄️ MongoDB Setup Guide for CareerNexus

## Option 1: Local MongoDB (Windows)

### Step 1: Download & Install MongoDB Community
1. Download: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB Community Server as a Windows Service
5. MongoDB will run automatically at startup

### Step 2: Verify MongoDB is Running
```powershell
# Open PowerShell and run:
Get-Service MongoDB | Select-Object Status
# Should show: Status: Running
```

### Step 3: Test Connection
```powershell
# Install MongoDB tools (optional, for testing)
mongosh
# You should see: test>
```

---

## Option 2: MongoDB Atlas (Cloud - Recommended for Easy Setup)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" (with email or Google)
3. Create a free cluster (M0 tier - free forever)

### Step 2: Get Connection String
1. In Atlas dashboard, click "CONNECT"
2. Choose "Drivers"
3. Copy the connection string
4. Replace `<username>` and `<password>` with your credentials
5. Replace `myFirstDatabase` with `careernexus`

### Step 3: Update .env File
Edit `backend/.env`:
```env
PORT=5000
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careernexus
```

### Step 4: Whitelist Your IP
1. In Atlas, go to "Network Access"
2. Click "ADD IP ADDRESS"
3. Click "ALLOW ACCESS FROM ANYWHERE" (for development)
4. Or add your specific IP address

---

## Troubleshooting Connection Errors

### Error: "connect ECONNREFUSED 127.0.0.1:27017"
- **Meaning**: MongoDB is not running
- **Fix**: 
  - For local: Start MongoDB service
  - For Atlas: Use correct connection string

### Error: "MongoError: Authentication failed"
- **Meaning**: Wrong username/password
- **Fix**: Double-check credentials in MONGODB_URI

### Error: "MongoError: server selection timeout"
- **Meaning**: Cannot reach MongoDB server
- **Fix**: 
  - Check internet connection
  - Verify IP is whitelisted (for Atlas)
  - Check MongoDB service is running

---

## Quick Start Commands

### Local MongoDB
```powershell
# Windows PowerShell - Check if running
Get-Service MongoDB

# Start service
Start-Service MongoDB

# Stop service
Stop-Service MongoDB

# View logs
mongosh
db.runCommand({serverStatus:1})
```

### Test Backend Connection
```bash
# After starting backend, test health endpoint
curl http://localhost:5000/api/health

# Should return:
# {"status":"Server is running"}
```

---

## Recommended: MongoDB Atlas + Backend Together

1. Create Atlas account and cluster
2. Get connection string
3. Update backend/.env with MONGODB_URI
4. Run: `cd backend && npm start`
5. Backend will auto-connect to cloud database
6. Start Expo with: `npx expo start`

This is the easiest and most reliable setup!
