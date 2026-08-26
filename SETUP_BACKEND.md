# 🚀 Connect Dashboard to Android App

## Why Stories Don't Show in App

**Current Flow:**
```
Dashboard → Browser localStorage
Android App → Backend API (not running) → ❌ No connection
```

**Need:**
```
Dashboard → Backend API → Database
Android App → Backend API → Database ✅ Both connected
```

---

## 📋 Two Options

### **Option 1: Quick Setup (Recommended)**
Install PostgreSQL and run backend - **~10 minutes**

### **Option 2: Advanced**
Full production setup with Docker

---

## 🎯 Option 1: Quick Setup

### **Step 1: Install PostgreSQL**

**macOS (using Homebrew):**
```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL
brew services start postgresql@16

# Verify it's running
psql --version
```

**Alternative - PostgreSQL App:**
1. Download: https://postgresapp.com/
2. Open the app
3. Click "Initialize"
4. PostgreSQL is running!

### **Step 2: Create Database**

```bash
# Create storyly database
createdb storyly

# Verify
psql -l | grep storyly
```

You should see `storyly` in the list.

### **Step 3: Setup Backend**

```bash
cd /Users/E2289/Documents/claudecode/storyly/backend

# Already installed dependencies ✅

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start backend server
npm run dev
```

**You should see:**
```
🚀 Storyly Backend running on port 3000
📝 Environment: development
🔗 API: http://localhost:3000/api/v1
```

### **Step 4: Update Dashboard to Use Backend**

The dashboard currently saves to localStorage. We need to make it save to the backend instead.

### **Step 5: Create API Key**

Once backend is running:

```bash
# In a new terminal
cd /Users/E2289/Documents/claudecode/storyly/backend

# Create API key (will add script)
node create-api-key.js
```

Copy the generated API key.

### **Step 6: Test in Android App**

1. Open Android app
2. Go to Settings
3. Uncheck "Use Mock Data"
4. Enter the API key
5. Click "Load Stories"
6. ✅ **Stories appear!**

---

## 🔧 Detailed Steps

### **Install PostgreSQL - Detailed**

**Method 1 - Homebrew (Recommended):**

```bash
# Check if Homebrew is installed
brew --version

# If not installed, install Homebrew first:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Check if running
brew services list | grep postgresql
```

**Method 2 - Postgres.app:**

1. Go to: https://postgresapp.com/
2. Download "Postgres.app"
3. Move to Applications folder
4. Open Postgres.app
5. Click "Initialize" button
6. PostgreSQL is now running!

### **Create Database - Detailed**

**If using Homebrew:**
```bash
createdb storyly
```

**If using Postgres.app:**
```bash
# Open terminal
/Applications/Postgres.app/Contents/Versions/16/bin/createdb storyly
```

**Verify database exists:**
```bash
psql -l
```

Look for `storyly` in the list.

### **Start Backend - Detailed**

```bash
# Navigate to backend
cd /Users/E2289/Documents/claudecode/storyly/backend

# Check .env file exists
cat .env

# Should show DATABASE_URL like:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/storyly?schema=public"

# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# When prompted for migration name, type: init
# Press Enter

# Start the server
npm run dev
```

**Expected output:**
```
🚀 Storyly Backend running on port 3000
📝 Environment: development
🔗 API: http://localhost:3000/api/v1
```

**Test it works:**
```bash
# In new terminal
curl http://localhost:3000/health
```

Should return:
```json
{"status":"ok","timestamp":"...","environment":"development"}
```

---

## 🔑 Create API Key

We need to create a proper API key for your Android app.

**Update the create-api-key script:**

```bash
cd /Users/E2289/Documents/claudecode/storyly/backend

# Create a user first (needed for API key)
# We'll use Prisma Studio for this
npm run prisma:studio
```

**In Prisma Studio (opens in browser):**

1. **Create User:**
   - Go to "User" table
   - Click "+ Add record"
   - Fill in:
     ```
     email: admin@storyly.com
     password_hash: $2a$10$... (we'll fix this)
     name: Admin User
     role: ADMIN
     ```
   - Click "Save 1 change"

2. **Create API Key:**
   - Go to "ApiKey" table
   - Click "+ Add record"
   - Fill in:
     ```
     key: sk_test_android_app_123456
     appName: Storyly Android App
     appId: com.example.storyly
     platform: ANDROID
     isActive: true
     createdById: (select the user you just created)
     ```
   - Click "Save 1 change"

3. **Copy the API key:**
   ```
   sk_test_android_app_123456
   ```

---

## 📱 Connect Android App

**In your Android app:**

1. **Open the app**
2. **Click "Change Settings"**
3. **Enter API Key:**
   ```
   sk_test_android_app_123456
   ```
4. **Uncheck "Use Mock Data"**
5. **Click "Start Demo"**
6. **Click "Load Stories"**

**If backend is running:**
- Stories will load (or show "No stories" if none created yet)
- No crash!
- Connection works!

---

## 📝 Create Story in Dashboard

**Now create a story that will actually save to database:**

1. **Dashboard:** http://localhost:5173/stories
2. **Create Story**
3. **Title:** "First Real Story"
4. **Upload** some images
5. **Click "Publish"**

**But wait!** - Dashboard still saves to localStorage.

We need to update the dashboard to use the backend API instead.

---

## 🔄 What Needs to Happen

**Current:**
```
Dashboard → localStorage ❌
Android → Backend API ❌ (not running)
```

**After backend setup:**
```
Dashboard → localStorage ❌ (still local)
Android → Backend API ✅ (now running)
```

**Final goal:**
```
Dashboard → Backend API → Database
Android → Backend API → Database
Both read/write from same database ✅
```

---

## ✅ Next Steps

**To make dashboard save to backend:**

1. Backend must be running ✅
2. Update dashboard to call API instead of localStorage
3. Both dashboard and Android app use same backend
4. Stories sync between both!

---

## 🚀 Quick Start Checklist

- [ ] Install PostgreSQL
- [ ] Create `storyly` database
- [ ] Run backend migrations
- [ ] Start backend server (port 3000)
- [ ] Create API key in Prisma Studio
- [ ] Test Android app with API key
- [ ] Update dashboard to use backend (next step)

---

## 💡 Want Me To:

**A.** Guide you through installing PostgreSQL step-by-step?

**B.** Help you start the backend and create API key?

**C.** Update dashboard to save to backend instead of localStorage?

**D.** All of the above - full setup?

Let me know which step you're on or where you need help! 🚀
