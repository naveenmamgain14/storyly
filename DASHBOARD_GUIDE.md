# 📊 Storyly Dashboard - Visual Guide

## 🌐 **Access the Dashboard**

**URL**: http://localhost:5173

Status: ✅ **RUNNING NOW!**

---

## 🔐 Login Screen

When you open http://localhost:5173, you'll see:

```
┌─────────────────────────────────────┐
│                                     │
│           Storyly                   │
│     Sign in to your dashboard       │
│                                     │
│  ┌───────────────────────────┐    │
│  │ Email                     │    │
│  │ you@example.com           │    │
│  └───────────────────────────┘    │
│                                     │
│  ┌───────────────────────────┐    │
│  │ Password                  │    │
│  │ ••••••••                  │    │
│  └───────────────────────────┘    │
│                                     │
│        [  Sign In  ]                │
│                                     │
└─────────────────────────────────────┘
```

**Credentials** (mock mode):
- Email: `anything@example.com`
- Password: `anything`

Just type anything and click **Sign In** - it's demo mode!

---

## 📱 Main Dashboard Layout

After login, you'll see:

```
┌──────────────────────────────────────────────────┐
│  Storyly                          Demo User  ⚙️   │
├──────────────────────────────────────────────────┤
│  Dashboard                                        │
│  Stories                                          │
│  Media                                            │
│  Analytics                                        │
│  Settings                                         │
├──────────────────────────────────────────────────┤
│                                                   │
│  Dashboard                                        │
│  ───────────                                      │
│                                                   │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐│
│  │Total   │  │Publish │  │Total   │  │Engage  ││
│  │Stories │  │  ed    │  │Views   │  │ Rate   ││
│  │   24   │  │   18   │  │ 12.4K  │  │  68%   ││
│  └────────┘  └────────┘  └────────┘  └────────┘│
│                                                   │
│  Recent Stories                                   │
│  ┌─────────────────────────────────────────┐    │
│  │ No stories yet                           │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## 📖 Pages Overview

### 1️⃣ **Dashboard Page** (Home)

**What you see:**
- Total Stories count
- Published count
- Total Views
- Engagement Rate
- Recent stories list

**What it's for:**
Quick overview of your platform performance

---

### 2️⃣ **Stories Page** 📱

```
┌──────────────────────────────────────────────────┐
│  Stories                    [ Create Story ]      │
├──────────────────────────────────────────────────┤
│                                                   │
│  No stories yet. Create your first story!        │
│                                                   │
│  [ Create Story ] ← Click this!                  │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Purpose**: Create and manage your stories

**How to create a story:**
1. Click **"Create Story"** button
2. Modal opens with form:
   - **Title**: e.g., "Summer Sale"
   - **Description**: e.g., "Our biggest sale ever!"
   - **Media Items**: Upload or select images/videos
   - **Duration**: 5 seconds per slide
   - **Action URL**: Optional link when clicked
3. Click **"Save"** or **"Publish"**

**Story will appear in list:**
```
┌─────────────────────────────────────────────┐
│ Title         │ Status    │ Items │ Actions │
├─────────────────────────────────────────────┤
│ Summer Sale   │ Published │   5   │ Edit Del│
│ New Products  │ Draft     │   3   │ Edit Pub│
└─────────────────────────────────────────────┘
```

---

### 3️⃣ **Media Library** 📤

```
┌──────────────────────────────────────────────────┐
│  Media Library              [ Upload Media ]      │
├──────────────────────────────────────────────────┤
│                                                   │
│  No media files yet. Upload images or videos!    │
│                                                   │
│  ┌─────────────────────────────────────┐        │
│  │  Drag & drop files here or click   │        │
│  │  to browse                          │        │
│  │                                     │        │
│  │  📎 Upload                          │        │
│  └─────────────────────────────────────┘        │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Purpose**: Upload and manage images/videos

**Supported formats:**
- **Images**: JPG, PNG, GIF, WebP
- **Videos**: MP4, WebM, QuickTime

**How to upload:**
1. Click **"Upload Media"**
2. Upload dialog appears
3. **Drag & drop** files OR **click to browse**
4. Select multiple files at once
5. Progress bar shows upload
6. Uploaded files appear in grid

**After upload:**
```
┌────┐ ┌────┐ ┌────┐ ┌────┐
│📷 1│ │📷 2│ │🎥 3│ │📷 4│
│IMG │ │IMG │ │VID │ │IMG │
└────┘ └────┘ └────┘ └────┘
```

---

### 4️⃣ **Analytics** 📊

```
┌──────────────────────────────────────────────────┐
│  Analytics                                        │
├──────────────────────────────────────────────────┤
│                                                   │
│  No analytics data yet                           │
│                                                   │
│  Start creating stories to see insights!         │
│                                                   │
│  Metrics will include:                           │
│  • Story views and impressions                   │
│  • Completion rates                              │
│  • Click-through rates                           │
│  • Time-based trends                             │
│  • Device breakdown                              │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Purpose**: View performance metrics

**What you'll see (when data is available):**
- 📈 Views over time (line chart)
- 🎯 Completion rates per story
- 👆 Click-through rates
- 📱 Device types (Android, iOS, Web)
- 🕐 Best performing times

---

### 5️⃣ **Settings** ⚙️

```
┌──────────────────────────────────────────────────┐
│  Settings                                         │
├──────────────────────────────────────────────────┤
│                                                   │
│  API Keys                                         │
│  ────────                                         │
│                                                   │
│  Manage your API keys for SDK integration       │
│                                                   │
│  [ Create API Key ]                              │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │ No API keys yet                          │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
└──────────────────────────────────────────────────┘
```

**Purpose**: Generate API keys for your apps

**How to create API key:**
1. Click **"Create API Key"**
2. Form appears:
   - **App Name**: "My Android App"
   - **App ID**: "com.example.storyly"
   - **Platform**: Android / iOS / Web
3. Click **"Generate"**
4. API key is created (looks like):
   ```
   sk_a1b2c3d4e5f6g7h8i9j0...
   ```
5. **Copy this key**
6. Use it in your Android app!

**Key will appear in list:**
```
┌─────────────────────────────────────────────┐
│ App Name         │ Platform │ Key          │
├─────────────────────────────────────────────┤
│ My Android App   │ Android  │ sk_a1b2...  │
│ iOS App          │ iOS      │ sk_x9y8...  │
└─────────────────────────────────────────────┘
```

---

## 🎯 Complete Workflow Example

### **From Dashboard to Android App**

**Step 1: Upload Media**
```
Media → Upload Media → Select files → Upload
✅ 3 images uploaded
```

**Step 2: Create Story**
```
Stories → Create Story
  Title: "Summer Sale"
  Add 3 images from media library
  Duration: 5 seconds each
  → Publish
✅ Story created and published
```

**Step 3: Create API Key**
```
Settings → Create API Key
  App Name: "My App"
  Platform: Android
  → Generate
✅ Copy key: sk_abc123...
```

**Step 4: Use in Android App**
```
Open Android app
  → Change Settings
  → Enter API key: sk_abc123...
  → Uncheck "Mock Data"
  → Start Demo
  → Load Stories
✅ See your Summer Sale story!
```

---

## 🎨 Dashboard Features Summary

| Feature | Page | What It Does |
|---------|------|--------------|
| **Overview** | Dashboard | See stats and metrics |
| **Create Stories** | Stories | Build story sequences |
| **Upload Media** | Media | Add images/videos |
| **View Analytics** | Analytics | Track performance |
| **API Keys** | Settings | Generate app keys |

---

## ⚡ Quick Access

**Dashboard is running at:**
```
http://localhost:5173
```

**Open it now:**
1. Open your browser
2. Go to: http://localhost:5173
3. Login with any email/password
4. Start exploring!

---

## 📋 Current Limitations

**Right now (without backend):**
- ✅ Can see the UI
- ✅ Can navigate pages
- ✅ Can interact with forms
- ❌ Cannot save data (no database)
- ❌ Cannot upload files (no backend)
- ❌ Cannot create real stories

**Once backend is running:**
- ✅ Everything will work!
- ✅ Real uploads
- ✅ Real data
- ✅ Real analytics

---

## 🚀 Want to Make It Fully Functional?

To enable **real uploads, data storage, and analytics**:

1. Install PostgreSQL
2. Start backend API
3. Everything will work!

**Let me know when you're ready for that step!** 

For now, enjoy exploring the **Dashboard UI**! 🎉
