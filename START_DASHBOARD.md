# 🎨 Storyly Dashboard - Complete Guide

## What Is The Dashboard?

The **Dashboard** is your web control panel where you:
- 📤 **Upload** images and videos
- 📱 **Create** stories from your media
- 📊 **View** analytics (views, engagement, clicks)
- 🔑 **Manage** API keys for your apps
- ⚙️ **Configure** story collections

---

## 🚀 How to Start the Dashboard

### Step 1: Open a New Terminal

Keep your Android emulator running, open a **new terminal window**.

### Step 2: Start the Dashboard

```bash
cd /Users/E2289/Documents/claudecode/storyly/dashboard
npm run dev
```

You'll see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open in Browser

1. Open your browser
2. Go to: **http://localhost:5173**
3. You'll see the **Login Page**

### Step 4: Login

**Credentials** (mock for now):
- Email: `demo@storyly.io`
- Password: (any password works - it's demo mode)

Click **"Sign In"**

---

## 📊 Dashboard Pages

### 1. **Dashboard (Overview)**
```
http://localhost:5173/dashboard
```
Shows:
- Total stories
- Published count
- Total views
- Engagement rate

### 2. **Stories**
```
http://localhost:5173/stories
```
- Create new stories
- Edit existing stories
- Publish/unpublish
- Delete stories

**How to create:**
1. Click "Create Story"
2. Add title and description
3. Upload media or select from library
4. Set duration for each slide
5. Click "Publish"

### 3. **Media Library**
```
http://localhost:5173/media
```
- Upload images (JPG, PNG, GIF, WebP)
- Upload videos (MP4, WebM)
- View all uploaded media
- Delete media files

**How to upload:**
1. Click "Upload Media"
2. Drag & drop or click to browse
3. Select multiple files
4. Wait for upload
5. Media is now in your library!

### 4. **Analytics**
```
http://localhost:5173/analytics
```
View:
- Story performance
- View counts
- Completion rates
- Click-through rates
- Time-based insights
- Device breakdown

### 5. **Settings**
```
http://localhost:5173/settings
```
- Create API keys for apps
- Manage user account
- Configure platform settings

**Create API Key:**
1. Go to Settings
2. Click "Create API Key"
3. Enter app name: "My Android App"
4. Select platform: Android
5. Click "Generate"
6. Copy the key
7. Use in Android app!

---

## 🎯 Complete Workflow

### **From Upload to App**

```
1. Open Dashboard → http://localhost:5173
   ↓
2. Go to Media → Upload images/videos
   ↓
3. Go to Stories → Create New Story
   ↓
4. Add uploaded media to story
   ↓
5. Set durations (5 seconds each)
   ↓
6. Click "Publish"
   ↓
7. Go to Settings → Create API Key
   ↓
8. Copy API key
   ↓
9. In Android app → Use that API key
   ↓
10. Uncheck "Mock Data" mode
    ↓
11. Click "Load Stories"
    ↓
12. See YOUR stories in the app! 🎉
```

---

## 🖼️ Dashboard Layout

```
┌─────────────────────────────────────────┐
│  Storyly                    [Demo User] │
├─────────────────────────────────────────┤
│                                          │
│  [Dashboard]  [Stories]  [Media]        │
│  [Analytics]  [Settings]                │
│                                          │
│  ┌─────────────────────────────────┐   │
│  │  Total Stories: 24              │   │
│  │  Published: 18                  │   │
│  │  Total Views: 12.4K             │   │
│  │  Engagement: 68%                │   │
│  └─────────────────────────────────┘   │
│                                          │
│  Recent Stories                          │
│  ┌─────────────────────────────────┐   │
│  │ Summer Sale - Published         │   │
│  │ New Products - Draft            │   │
│  └─────────────────────────────────┘   │
│                                          │
└─────────────────────────────────────────┘
```

---

## 📱 What You Need Running

For the **full experience**, you need 3 things running:

### Terminal 1: Backend (Future - Not Required Yet)
```bash
cd backend
npm run dev
# Port 3000
```

### Terminal 2: Dashboard (Required Now)
```bash
cd dashboard
npm run dev
# Port 5173
```

### Terminal 3: PostgreSQL (Future)
```bash
brew services start postgresql@16
```

**For now:** Just run the **Dashboard** to see the UI!

---

## 🎨 Dashboard Features

### **Stories Page**

**Table View:**
| Title | Status | Items | Created | Actions |
|-------|--------|-------|---------|---------|
| Summer Sale | Published | 5 | 2 days ago | Edit/Delete |
| New Products | Draft | 3 | 1 hour ago | Edit/Publish |

**Actions:**
- ✏️ Edit - Modify story
- 🗑️ Delete - Remove story
- 📤 Publish - Make live
- 📥 Unpublish - Take offline

### **Media Library**

**Grid View:**
```
┌────┐ ┌────┐ ┌────┐ ┌────┐
│📷  │ │📷  │ │🎥  │ │📷  │
│img1│ │img2│ │vid1│ │img3│
└────┘ └────┘ └────┘ └────┘
```

**Upload:**
- Drag & drop zone
- Multiple file support
- Progress indicators
- Thumbnail preview

### **Analytics Dashboard**

**Metrics:**
```
Story Performance
┌─────────────────────────┐
│ Impressions: 10.2K      │
│ Views: 8.5K             │
│ Completion: 68%         │
│ Avg. Time: 12s          │
└─────────────────────────┘

Top Stories
1. Summer Sale - 2.3K views
2. New Products - 1.8K views
3. Flash Deals - 1.2K views
```

---

## ⚡ Quick Start Commands

```bash
# Start Dashboard
cd /Users/E2289/Documents/claudecode/storyly/dashboard
npm run dev

# Open in browser
open http://localhost:5173

# Login
Email: demo@storyly.io
Password: anything
```

---

## 🐛 Troubleshooting

### Dashboard won't start
```bash
cd dashboard
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port 5173 already in use
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Try again
npm run dev
```

### Can't login
- Any email works (mock mode)
- Any password works
- Just click "Sign In"

---

## 📋 Next Steps

1. ✅ Start dashboard: `npm run dev`
2. ✅ Open: http://localhost:5173
3. ✅ Login with demo credentials
4. ✅ Explore the UI
5. ⚠️ Features are UI-only until backend is running
6. 📝 When ready for backend: Install PostgreSQL

---

## 🎯 Current Status

- ✅ Dashboard UI: READY
- ✅ Android App: WORKING (mock mode)
- ⚠️ Backend API: NOT STARTED
- ⚠️ Database: NOT RUNNING
- ⚠️ Real data: NOT AVAILABLE YET

**Right now:** You can see the **UI and design** of the dashboard, but it won't save real data until we set up PostgreSQL + Backend.

---

## 💡 Want Real Data?

To make everything work with **real uploads and data**:

1. Install PostgreSQL
2. Start backend
3. Create API keys
4. Upload media
5. Create stories
6. See them in Android app!

**Let me know when you want to set that up!** 🚀
