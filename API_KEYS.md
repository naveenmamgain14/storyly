# Storyly API Keys & Configuration

## 🔑 API Keys

### Storyly Android App
```
sk_35baf0a65c31b273ed2f9c043a49997f4769d78054128558ade21beb9380e23b
```
- **App Name:** Storyly Android App
- **App ID:** com.example.storyly
- **Platform:** Android

### Medicine App (Android)
```
sk_80a04e238f59d10ec6072aca8ad0cbcdead96cf2d32edf1c288e16c975216781
```
- **App Name:** Medicine App
- **App ID:** com.medicine.app
- **Platform:** Android

---

## 🌐 Production URLs

### Dashboard
**URL:** https://storyly-dashboard.nbg1-2.instapods.app

### Backend API
- **Internal:** http://localhost:3001/api/v1
- **Accessible from dashboard:** ✓

---

## 💻 Local Development

### Start Local Environment
```bash
./START_LOCAL.sh
```

This will start:
- Backend API on http://localhost:3001
- Dashboard on http://localhost:5173

### Manual Start

**Backend:**
```bash
cd backend
npm start
```

**Dashboard:**
```bash
cd dashboard
npm run dev
```

---

## 🗄️ Database

### Supabase Configuration
- **Host:** db.sdsdwegkmkfdmiznjkty.supabase.co
- **Port:** 5432
- **Database:** postgres
- **User:** postgres
- **Connection String:** (stored in backend/.env)

---

## 📱 Android Integration

### Using in Your Android App

**Kotlin:**
```kotlin
// Initialize StorylyView
StorylyView(
    apiKey = "YOUR_API_KEY_HERE", // Use one of the keys above
    backendUrl = "https://storyly-dashboard.nbg1-2.instapods.app"
)
```

**Testing Locally:**
```kotlin
// For local testing (use your machine's IP, not localhost)
StorylyView(
    apiKey = "YOUR_API_KEY_HERE",
    backendUrl = "http://YOUR_LOCAL_IP:3001" // e.g., http://192.168.1.100:3001
)
```

---

## 🔐 Demo Credentials

### Dashboard Login
- **Email:** demo@storyly.io
- **Password:** password123

---

## ✅ Deployment Status

| Component | Status | Location |
|-----------|--------|----------|
| Dashboard | ✅ Deployed | https://storyly-dashboard.nbg1-2.instapods.app |
| Backend API | ✅ Running | Port 3001 |
| Database | ✅ Connected | Supabase |
| Local Build | ✅ Ready | Run ./START_LOCAL.sh |

---

## 📊 Next Steps

1. **Test Locally:** Run `./START_LOCAL.sh`
2. **Access Dashboard:** Visit http://localhost:5173
3. **Create Stories:** Use the dashboard to manage content
4. **Integrate Android:** Use the API keys in your Android apps
5. **Test API:** Both local and production endpoints are ready

---

**Generated:** 2026-09-16
**Project:** Storyly Platform - Instagram-style Stories SDK
