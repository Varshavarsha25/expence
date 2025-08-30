# How to Run Your Expense Management Application

## 🚀 Quick Start (Both Servers)

You have several options to run both backend and frontend servers:

### Option 1: Use the Batch File (Windows)
```cmd
# Double-click or run in command prompt:
start-dev.bat
```

### Option 2: Use PowerShell Script
```powershell
# Right-click and "Run with PowerShell" or:
powershell -ExecutionPolicy Bypass -File start-dev.ps1
```

### Option 3: Manual Commands (Two Terminals)

**Terminal 1 - Backend:**
```cmd
cd "d:\first project\backend"
npm run dev
```

**Terminal 2 - Frontend:**
```cmd
cd "d:\first project"
npm run dev
```

### Option 4: Single Command (if concurrently is set up)
```cmd
cd "d:\first project"
npm run dev:all
```

## 📱 Access Your Application

Once both servers are running:

- **Frontend (React App)**: http://localhost:3000
- **Backend (API)**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Endpoints**: http://localhost:3001/api/expenses

## 🔍 Verify Everything is Working

1. **Backend Status**: Visit http://localhost:3001/health
   - Should show: `{"status":"OK","message":"Expense Management API is running"}`

2. **Frontend Status**: Visit http://localhost:3000
   - Should show green "Connected" status in the header

3. **Database Connection**: In the frontend, you should see:
   - Green dot with "Backend: Connected" in the header
   - Ability to create and save expenses

## 🛠️ Current Status

✅ **Backend Server**: Running on port 3001
✅ **Frontend Server**: Running on port 3000  
✅ **Database**: Connected to Neon PostgreSQL
✅ **API Integration**: Frontend ↔ Backend ↔ Database

## 🔧 Troubleshooting

### Backend Issues:
- Check if port 3001 is available
- Verify `.env` file exists in `/backend` folder
- Run `npm install` in `/backend` folder if needed

### Frontend Issues:
- Check if port 3000 is available
- Verify `.env` file exists in project root
- Run `npm install` in project root if needed

### Database Issues:
- Verify Neon database is active (not paused)
- Check `DATABASE_URL` in `/backend/.env`
- Run `npm run db:push` in `/backend` to sync schema

## 📊 Available Commands

### Backend Commands (run from `/backend` folder):
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

### Frontend Commands (run from project root):
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run dev:backend # Start only backend
npm run dev:all     # Start both servers (requires concurrently)
```

Your expense management application is ready to use! 🎉
