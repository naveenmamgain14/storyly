# Deploy Storyly from GitHub to Instapod

Quick guide to deploy your Storyly platform to Instapod.

---

## 📦 **Project Structure**

```
storyly/
├── backend/              # Node.js API
├── dashboard/            # React Dashboard  
├── android-sdk/          # Android SDK (optional - for reference)
└── Documentation files
```

---

## 🚀 **Step 1: Push to GitHub**

Repository is ready! Now push to GitHub:

```bash
# Go to GitHub.com and create a new repository named "storyly"
# DON'T initialize it with README

# Then run:
cd /Users/E2289/Documents/claudecode/storyly

git remote add origin https://github.com/YOUR_USERNAME/storyly.git
git push -u origin main
```

---

## 🎯 **Step 2: Deploy Backend to Instapod**

### In Instapod Dashboard:

1. **Create New App** → Choose **Node.js**
2. **Connect GitHub** → Select `storyly` repository
3. **Configure:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`
   - **Port:** `3000` or `3001`

4. **Add Environment Variables:**
   ```
   DATABASE_URL=<your_instapod_postgres_url>
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=https://your-dashboard-url.instapod.io
   ```

5. **Add PostgreSQL Database** (if available in Instapod)

6. **Deploy** → Instapod will build and run

7. **After first deploy, run:**
   - In Instapod terminal/console:
   ```bash
   npx prisma db push
   node scripts/create-api-key.js
   ```

---

## 🎨 **Step 3: Deploy Dashboard to Instapod**

### Option A: If Instapod Supports Static Sites

1. **Create New Static Site**
2. **Connect GitHub** → `storyly` repository  
3. **Configure:**
   - **Root Directory:** `dashboard`
   - **Build Command:** `npm install && npm run build`
   - **Output Directory:** `dist`

4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-backend-url.instapod.io/api/v1
   ```

5. **Deploy**

### Option B: Deploy as Node.js App

1. **Create New App** → Node.js
2. **Connect GitHub** → `storyly` repository
3. **Configure:**
   - **Root Directory:** `dashboard`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npx serve dist -p $PORT`

4. **Add to `package.json` in dashboard:**
   ```json
   {
     "dependencies": {
       "serve": "^14.2.0"
     }
   }
   ```

---

## 📱 **Step 4: Update Android SDK**

Once deployed, update your Android app:

```kotlin
StorylyView(
    apiKey = "sk_prod_xxxxx",  // From step 2
    backendUrl = "https://your-backend.instapod.io"
)
```

---

## 🔧 **Environment Variables**

### Backend (Instapod)
```
DATABASE_URL=postgresql://user:pass@host:5432/database
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://dashboard-url
```

### Dashboard (Instapod)
```
VITE_API_URL=https://backend-url/api/v1
```

---

## ✅ **Verify Deployment**

### Test Backend:
```bash
curl https://your-backend.instapod.io/health
```

### Test API:
```bash
curl -H "X-API-Key: YOUR_KEY" \
     https://your-backend.instapod.io/api/v1/sdk/stories
```

### Test Dashboard:
Open: `https://your-dashboard.instapod.io`

---

## 🔄 **Auto-Deploy on Push**

Once connected to GitHub, Instapod will auto-deploy when you push:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Instapod auto-deploys! 🎉
```

---

## 📝 **Quick Reference**

| Component | Deploy To | Build Command | Start Command |
|-----------|-----------|---------------|---------------|
| Backend | Node.js App | `npm install && npx prisma generate && npm run build` | `npm start` |
| Dashboard | Static Site / Node.js | `npm install && npm run build` | `npx serve dist -p $PORT` |

---

## 🆘 **Troubleshooting**

### Build fails:
- Check Node.js version (use v18+)
- Check environment variables are set
- Check build logs in Instapod

### Database connection fails:
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is provisioned
- Check database credentials

### CORS errors:
- Update CORS_ORIGIN to match dashboard URL
- Restart backend after changing env vars

---

## 🎉 **Done!**

Your URLs:
- **Backend:** `https://storyly-backend.instapod.io`
- **Dashboard:** `https://storyly-dashboard.instapod.io`

Use in Android:
```kotlin
StorylyView(
    apiKey = "sk_prod_your_key",
    backendUrl = "https://storyly-backend.instapod.io"
)
```

---

Built with ❤️ - Ready for Instapod deployment!
