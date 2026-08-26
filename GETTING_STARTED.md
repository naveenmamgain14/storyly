# Getting Started with Storyly Platform

Complete step-by-step guide to get your Storyly platform up and running.

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js 18 or higher (`node --version`)
- ✅ npm or yarn package manager
- ✅ Docker Desktop (recommended) OR PostgreSQL 14+ installed
- ✅ Android Studio (if working on the SDK)
- ✅ Git

## Step 1: Start Database Services

### Option A: Using Docker (Recommended)

```bash
# Navigate to project directory
cd /Users/E2289/Documents/claudecode/storyly

# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps

# You should see:
# storyly-postgres - Up and healthy
# storyly-redis    - Up and healthy
```

### Option B: Using Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql@16

# Start PostgreSQL
brew services start postgresql@16

# Create database
createdb storyly
```

## Step 2: Setup Backend API

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings
# For Docker setup, default values should work fine
nano .env

# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Start the backend server
npm run dev
```

You should see:
```
🚀 Storyly Backend running on port 3000
📝 Environment: development
🔗 API: http://localhost:3000/api/v1
```

**Test the backend:**
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "environment": "development"
}
```

## Step 3: Setup Web Dashboard

Open a **new terminal window**:

```bash
# Navigate to dashboard directory
cd /Users/E2289/Documents/claudecode/storyly/dashboard

# Install dependencies
npm install

# Start the dashboard
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Open browser:** Go to `http://localhost:5173`

You'll see the login page. Use these demo credentials:
- Email: `demo@storyly.io`
- Password: (any password - it's mocked for now)

## Step 4: Create Your First Content

### 4.1 Create an API Key

1. Login to dashboard (`http://localhost:5173`)
2. Navigate to **Settings**
3. Click **"Create API Key"** (when implemented)
4. Name it "My Android App"
5. Select platform: Android
6. Copy the generated API key

### 4.2 Upload Media

1. Go to **Media Library**
2. Click **"Upload Media"**
3. Upload an image or video
4. Wait for upload to complete

### 4.3 Create a Story

1. Go to **Stories**
2. Click **"Create Story"**
3. Enter a title
4. Add your uploaded media as story items
5. Set duration for each item (default 5 seconds)
6. Click **"Save as Draft"**
7. Click **"Publish"** to make it live

## Step 5: Test with Android SDK

### 5.1 Open SDK in Android Studio

```bash
# Open Android Studio
# File → Open → Select: /Users/E2289/Documents/claudecode/storyly/android-sdk
```

### 5.2 Create a Test App

Create a simple Activity with StorylyView:

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val storyly = rememberStoryly(
                context = LocalContext.current,
                apiKey = "YOUR_API_KEY_HERE",
                config = StorylyConfig(
                    baseUrl = "http://10.0.2.2:3000/api/v1"
                )
            )
            
            StorylyView(storyly = storyly)
        }
    }
}
```

**Important**: For Android Emulator, use `10.0.2.2` instead of `localhost`

### 5.3 Run on Emulator

1. Start an Android emulator
2. Run the app
3. You should see your stories loaded!

## Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:3000/health
```

### Get Stories (with API Key)
```bash
curl -H "X-API-Key: YOUR_API_KEY" http://localhost:3000/api/v1/sdk/stories
```

### Dashboard
Open `http://localhost:5173` in browser

## Common Issues & Solutions

### Backend won't start

**Error**: "Port 3000 is already in use"
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

**Error**: "Cannot connect to database"
```bash
# Check if PostgreSQL is running
docker-compose ps
# or
brew services list | grep postgresql
```

### Dashboard shows blank page

```bash
# Clear npm cache and reinstall
cd dashboard
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Android SDK can't connect

**Issue**: SDK can't reach backend from emulator

- ✅ Use `10.0.2.2:3000` instead of `localhost:3000`
- ✅ Check backend is running: `curl http://localhost:3000/health`
- ✅ Check API key is valid
- ✅ Check Android internet permission in AndroidManifest.xml

### Database is empty

```bash
# Reset and recreate database
cd backend
npm run prisma:migrate reset
```

## Next Steps

1. **Explore the Dashboard**
   - Create multiple stories
   - Upload different media types
   - View analytics (when implemented)

2. **Customize the SDK**
   - Modify colors and themes
   - Add custom interactions
   - Implement offline caching

3. **Implement Authentication**
   - Replace mock login with real JWT auth
   - Add user registration
   - Set up role-based access

4. **Add Media Processing**
   - Implement thumbnail generation
   - Add video transcoding
   - Set up CDN for production

5. **Deploy to Production**
   - Set up cloud database (AWS RDS, etc.)
   - Configure S3 for media storage
   - Deploy backend to cloud (Heroku, AWS, etc.)
   - Deploy dashboard to static hosting

## Development Tips

### Running All Services

Create a bash script `start-dev.sh`:

```bash
#!/bin/bash
docker-compose up -d
cd backend && npm run dev &
cd dashboard && npm run dev &
```

Make it executable:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### View Database

```bash
cd backend
npm run prisma:studio
```

Opens GUI at `http://localhost:5555`

### Monitor Logs

```bash
# Backend logs
cd backend && npm run dev

# Docker logs
docker-compose logs -f postgres
```

## Need Help?

- Check [Architecture Documentation](./ARCHITECTURE.md)
- Review component READMEs:
  - [Backend](./backend/README.md)
  - [Dashboard](./dashboard/README.md)
  - [Android SDK](./android-sdk/README.md)

---

**You're all set!** 🎉 Start building amazing story experiences!
