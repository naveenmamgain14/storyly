# Storyly Production Deployment Guide

Deploy your Storyly backend, database, and dashboard to production servers.

---

## 🚀 Recommended: Railway (All-in-One)

Railway can host everything with one command. **Free tier available.**

### **What Railway Provides:**
- ✅ PostgreSQL database (managed)
- ✅ Backend API hosting
- ✅ Dashboard hosting
- ✅ Automatic HTTPS
- ✅ Free tier (no credit card needed)

---

## 📦 **Option 1: Deploy to Railway (Recommended)**

### **Step 1: Install Railway CLI**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login
```

### **Step 2: Deploy Database**

```bash
cd /Users/E2289/Documents/claudecode/storyly/backend

# Initialize Railway project
railway init

# Add PostgreSQL
railway add

# Select: PostgreSQL
```

Railway will provide a `DATABASE_URL`. Copy it.

### **Step 3: Deploy Backend**

```bash
cd /Users/E2289/Documents/claudecode/storyly/backend

# Deploy backend
railway up

# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=3000

# Backend will be live at: https://your-app.railway.app
```

### **Step 4: Deploy Dashboard**

```bash
cd /Users/E2289/Documents/claudecode/storyly/dashboard

# Create new Railway project
railway init

# Set environment variable
railway variables set VITE_API_URL=https://your-backend.railway.app/api/v1

# Deploy
railway up

# Dashboard will be live at: https://your-dashboard.railway.app
```

### **Step 5: Update Database**

```bash
cd /Users/E2289/Documents/claudecode/storyly/backend

# Run migrations on production database
railway run npx prisma db push

# Create API key
railway run node scripts/create-api-key.js
```

---

## 📦 **Option 2: Deploy to Render**

### **Backend + Database**

1. Go to: https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `cd backend && npm install && npx prisma generate`
   - **Start Command:** `cd backend && npm start`
   - **Add PostgreSQL database** (free)

### **Dashboard**

1. Click **"New +"** → **"Static Site"**
2. Settings:
   - **Build Command:** `cd dashboard && npm install && npm run build`
   - **Publish Directory:** `dashboard/dist`
   - **Add env var:** `VITE_API_URL=https://your-backend.onrender.com/api/v1`

---

## 📦 **Option 3: Deploy to Vercel + Supabase**

### **Database (Supabase)**

1. Go to: https://supabase.com
2. Create new project
3. Get `DATABASE_URL` from settings
4. Run migrations:
   ```bash
   DATABASE_URL="postgresql://..." npx prisma db push
   ```

### **Backend (Vercel)**

```bash
cd /Users/E2289/Documents/claudecode/storyly/backend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables on Vercel dashboard:
# - DATABASE_URL
# - NODE_ENV=production
```

### **Dashboard (Vercel)**

```bash
cd /Users/E2289/Documents/claudecode/storyly/dashboard

# Deploy
vercel

# Set env var: VITE_API_URL
```

---

## 🔧 **Prepare Backend for Production**

### **1. Update CORS**

Edit `/Users/E2289/Documents/claudecode/storyly/backend/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'https://your-dashboard.railway.app',
    'https://your-dashboard.vercel.app',
    // Add your production domains
  ],
  credentials: true
}));
```

### **2. Create API Key Script**

Create `/Users/E2289/Documents/claudecode/storyly/backend/scripts/create-api-key.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createApiKey() {
  // Create user first
  const user = await prisma.user.upsert({
    where: { email: 'admin@storyly.io' },
    update: {},
    create: {
      email: 'admin@storyly.io',
      passwordHash: 'hashed',
      name: 'Admin',
      role: 'ADMIN'
    }
  });

  // Create API key
  const apiKey = await prisma.apiKey.create({
    data: {
      key: 'sk_prod_' + Math.random().toString(36).substring(2, 15),
      name: 'Production SDK Key',
      type: 'SDK',
      isActive: true,
      createdById: user.id
    }
  });

  console.log('✅ API Key created:', apiKey.key);
  console.log('📝 Use this in your Android SDK');
}

createApiKey()
  .then(() => process.exit(0))
  .catch(console.error);
```

### **3. Add Production Scripts**

Edit `/Users/E2289/Documents/claudecode/storyly/backend/package.json`:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "deploy": "npm run build && node dist/index.js"
  }
}
```

---

## 🔧 **Prepare Dashboard for Production**

### **1. Update API URL**

Create `/Users/E2289/Documents/claudecode/storyly/dashboard/.env.production`:

```env
VITE_API_URL=https://your-backend.railway.app/api/v1
```

### **2. Update Build Config**

Edit `/Users/E2289/Documents/claudecode/storyly/dashboard/vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

---

## 📱 **Update SDK for Production**

### **1. Make Backend URL Configurable**

Edit `/Users/E2289/AndroidStudioProjects/storyly/storyly-sdk/src/main/java/com/storyly/sdk/ui/StorylyView.kt`:

```kotlin
@Composable
fun StorylyView(
    apiKey: String,
    modifier: Modifier = Modifier,
    config: StorylyConfig = StorylyConfig(),
    backendUrl: String = "http://10.0.2.2:3000" // Default to local
) {
    // ... rest of code
    
    // Update loadStoriesFromBackend to use backendUrl
    val url = java.net.URL("$backendUrl/api/v1/sdk/stories")
}
```

### **2. Use Production URL in Apps**

```kotlin
StorylyView(
    apiKey = "sk_prod_your_key",
    backendUrl = "https://your-backend.railway.app"
)
```

---

## 🌐 **Quick Deploy with Railway (5 minutes)**

### **All-in-One Script**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy Backend + Database
cd /Users/E2289/Documents/claudecode/storyly/backend
railway init
railway add # Choose PostgreSQL
railway up
railway variables set NODE_ENV=production

# Get backend URL
railway domain

# Deploy Dashboard
cd /Users/E2289/Documents/claudecode/storyly/dashboard
railway init
railway variables set VITE_API_URL=https://YOUR_BACKEND_URL/api/v1
railway up

# Get dashboard URL
railway domain

# Setup database
cd /Users/E2289/Documents/claudecode/storyly/backend
railway run npx prisma db push
railway run node scripts/create-api-key.js
```

**Done! You'll get:**
- Backend: `https://storyly-backend.railway.app`
- Dashboard: `https://storyly-dashboard.railway.app`
- Database: Managed PostgreSQL on Railway

---

## 🔐 **Environment Variables**

### **Backend**
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-dashboard.railway.app
```

### **Dashboard**
```env
VITE_API_URL=https://your-backend.railway.app/api/v1
```

---

## ✅ **Post-Deployment Checklist**

- [ ] Backend deployed and accessible
- [ ] Database created and migrated
- [ ] API key created
- [ ] Dashboard deployed
- [ ] CORS configured for dashboard URL
- [ ] Test story creation via dashboard
- [ ] Update SDK with production URL
- [ ] Test SDK with production backend
- [ ] Add custom domain (optional)

---

## 🔍 **Testing Production Deployment**

### **1. Test Backend**
```bash
curl https://your-backend.railway.app/health
```

### **2. Test API**
```bash
curl -H "X-API-Key: sk_prod_xxx" \
     https://your-backend.railway.app/api/v1/sdk/stories
```

### **3. Test Dashboard**
Open: `https://your-dashboard.railway.app`

### **4. Test SDK**
Update your Android app:
```kotlin
StorylyView(
    apiKey = "sk_prod_xxx",
    backendUrl = "https://your-backend.railway.app"
)
```

---

## 💰 **Pricing**

### **Railway (Recommended)**
- Free tier: $5/month credit
- Enough for: Small apps
- Upgrade: $20/month

### **Render**
- Free tier: Yes
- Database: Free 90 days, then $7/month
- Web service: Free with limitations

### **Vercel + Supabase**
- Vercel: Free tier generous
- Supabase: Free tier with 500MB database

---

## 🆘 **Troubleshooting**

### **CORS errors**
Add your dashboard URL to CORS in backend:
```typescript
origin: ['https://your-dashboard.railway.app']
```

### **Database connection fails**
Check `DATABASE_URL` format:
```
postgresql://username:password@host:port/database?sslmode=require
```

### **SDK can't connect**
- Use HTTPS URLs (not HTTP)
- Check API key is correct
- Verify backend is running

---

## 📝 **Summary**

**Easiest deployment:**
1. Use Railway for everything
2. Run deployment script above
3. Update SDK with production URL
4. Done in 5 minutes!

**Your URLs:**
- Backend: `https://storyly-backend.railway.app`
- Dashboard: `https://storyly-dashboard.railway.app`
- SDK connects to: Backend URL with API key

**Next:** Your SDK works from anywhere! 🚀
