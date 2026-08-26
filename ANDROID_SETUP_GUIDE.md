# Android Setup Guide - Step by Step

## 🎯 Quick Answer

**To see this in Android Studio:**

1. Open Android Studio
2. Click `File` → `Open`
3. Navigate to: `/Users/E2289/Documents/claudecode/storyly/demo-app`
4. Click `Open`
5. Wait for Gradle sync
6. Click ▶️ Run

That's it! The demo app will launch.

---

## 📱 Two Ways to Open the Project

### Option 1: Demo App (Recommended for Testing)

**Path**: `/Users/E2289/Documents/claudecode/storyly/demo-app`

This includes:
- ✅ The Storyly SDK
- ✅ A working demo app
- ✅ Sample integration code
- ✅ UI to test the SDK

### Option 2: SDK Only (For SDK Development)

**Path**: `/Users/E2289/Documents/claudecode/storyly/android-sdk`

This includes:
- ✅ Just the SDK library
- ❌ No demo app
- Use this if you want to modify the SDK itself

---

## 🚀 Complete Setup Instructions

### Step 1: Start Backend Server

Before running the Android app, start the backend:

```bash
# Terminal 1: Start databases
cd /Users/E2289/Documents/claudecode/storyly
docker-compose up -d

# Terminal 2: Start backend
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

You should see:
```
🚀 Storyly Backend running on port 3000
```

### Step 2: Open Android Studio

1. Launch **Android Studio**

2. On the Welcome Screen:
   - Click **"Open"**
   
   OR if a project is already open:
   - Click **File** → **Open**

3. Navigate to demo app:
   ```
   /Users/E2289/Documents/claudecode/storyly/demo-app
   ```

4. Click **"Open"**

5. Wait for **Gradle Sync** to complete (bottom right corner)

### Step 3: Create an Emulator (if you don't have one)

1. Click **Device Manager** (phone icon on right sidebar)
2. Click **"Create Device"**
3. Select **"Pixel 6"** → Click **Next**
4. Select **"Tiramisu"** (API 33) → Click **Next**
5. Click **Finish**

### Step 4: Run the App

1. Click the green ▶️ **Run** button (top right)
2. Select your emulator
3. Wait for app to install and launch

### Step 5: Configure the App

When the app opens:

1. You'll see a **"Configure Storyly SDK"** screen

2. **Get an API Key**:
   - Open browser: `http://localhost:5173`
   - Login to dashboard
   - Go to **Settings** → **API Keys**
   - Create new key
   - Copy the key

3. **Enter API Key** in the Android app

4. Click **"Start Demo"**

5. Click **"Load Stories"**

If backend is running and has published stories, they'll appear!

---

## 📂 What You'll See in Android Studio

### Project Structure

```
demo-app/
├── app/                          # Demo Application
│   ├── src/main/
│   │   ├── java/com/storyly/demo/
│   │   │   └── MainActivity.kt   # Main demo activity ← Look here
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
│
└── storyly/                      # The SDK (linked from android-sdk/)
    ├── src/main/java/com/storyly/sdk/
    │   ├── Storyly.kt           # SDK entry point
    │   ├── model/Models.kt       # Data models
    │   ├── network/             # API layer
    │   ├── data/                # Repository
    │   └── ui/StoryView.kt      # UI components
    └── build.gradle.kts
```

### Key Files to Explore

1. **`MainActivity.kt`** - Demo app showing SDK integration
2. **`storyly/Storyly.kt`** - SDK initialization
3. **`storyly/ui/StoryView.kt`** - Story viewer UI
4. **`storyly/network/StorylyApiService.kt`** - API definitions

---

## 🎨 What the Demo App Does

### Configuration Screen
- Enter your API key
- Shows backend URL
- Start button to initialize SDK

### Main Screen
- **Story Viewer**: Horizontal scrolling story list
- **Load Button**: Fetch stories from backend
- **Status Card**: Shows:
  - Loading state
  - Number of stories loaded
  - Error messages (if any)
- **Instructions Card**: Setup help

### How to Use
1. Enter API key → Click "Start Demo"
2. Click "Load Stories"
3. Stories appear if:
   - ✅ Backend is running
   - ✅ API key is valid
   - ✅ Stories are published in dashboard

---

## 🔧 Common Issues

### Issue 1: Gradle Sync Failed

**Solution**:
```bash
cd /Users/E2289/Documents/claudecode/storyly/demo-app
./gradlew clean build
```

Then in Android Studio: **File** → **Sync Project with Gradle Files**

### Issue 2: "Cannot resolve symbol 'storyly'"

**Solution**:
1. Check that `settings.gradle.kts` includes:
   ```kotlin
   include(":storyly")
   project(":storyly").projectDir = File("../android-sdk/storyly")
   ```

2. **File** → **Invalidate Caches** → **Invalidate and Restart**

### Issue 3: App crashes or "Network error"

**Checklist**:
- ✅ Backend running? `curl http://localhost:3000/health`
- ✅ Using emulator? URL should be `http://10.0.2.2:3000`
- ✅ Using device? URL should be `http://YOUR_COMPUTER_IP:3000`
- ✅ AndroidManifest has `usesCleartextTraffic="true"`?

### Issue 4: No stories loading

1. Check dashboard has published stories
2. Verify API key is correct
3. Look at Logcat in Android Studio for errors

---

## 💻 Using Logcat to Debug

In Android Studio:

1. Click **Logcat** tab (bottom)
2. Run the app
3. Filter by: `package:com.storyly`
4. Look for network errors or API responses

---

## 📝 Making Changes

### To Modify the SDK:

1. Open files in `storyly/src/main/java/com/storyly/sdk/`
2. Make your changes
3. Click **Build** → **Rebuild Project**
4. Run the demo app to test

### To Modify the Demo App:

1. Open `app/src/main/java/com/storyly/demo/MainActivity.kt`
2. Make changes
3. Click Run ▶️

---

## 🎯 Integration in Your Own App

Once you've tested the demo, integrate in your app:

```kotlin
// In your build.gradle.kts
dependencies {
    implementation(project(":storyly"))
}

// In your Activity/Composable
@Composable
fun MyScreen() {
    val storyly = rememberStoryly(
        context = LocalContext.current,
        apiKey = "your-api-key-here",
        config = StorylyConfig(
            baseUrl = "https://your-backend.com/api/v1"
        )
    )
    
    StorylyView(storyly = storyly)
}
```

---

## ✅ Verification Checklist

Before running the demo:

- [ ] Backend running on port 3000
- [ ] Dashboard accessible at localhost:5173
- [ ] API key created in dashboard
- [ ] At least one published story exists
- [ ] Android Studio opened demo-app folder
- [ ] Gradle sync completed successfully
- [ ] Emulator or device ready

---

## 🎥 What You Should See

1. **On App Launch**: Configuration screen asking for API key
2. **After entering API key**: Main screen with "Load Stories" button
3. **After clicking Load**: 
   - Loading indicator
   - Stories appear in horizontal list
   - Each story shows its title
4. **Status updates** in the status card

---

## 📞 Next Steps

1. ✅ **Test the integration** - Run demo app
2. ✅ **Explore the code** - See how SDK works
3. ✅ **Create stories** - Use the dashboard
4. ✅ **Customize UI** - Modify StoryView.kt
5. ✅ **Add features** - Enhance the viewer

---

## 🆘 Still Having Issues?

Check these files:
- `demo-app/README.md` - Demo app specific help
- `GETTING_STARTED.md` - Full platform setup
- `android-sdk/README.md` - SDK documentation

Or review the logs:
```bash
# Android logcat via command line
adb logcat | grep Storyly
```

---

**You're all set!** Open Android Studio, load the demo-app, and start testing! 🚀
