# Storyly Demo App

Demo Android application showcasing the Storyly SDK integration.

## How to Open in Android Studio

### Method 1: Open Demo App (Recommended)

1. **Open Android Studio**

2. **Open Project**:
   - Click `File` → `Open`
   - Navigate to: `/Users/E2289/Documents/claudecode/storyly/demo-app`
   - Click `Open`

3. **Wait for Gradle Sync**: Android Studio will automatically sync the project

4. **Run the App**:
   - Click the green ▶️ play button
   - Select an emulator or connected device
   - App will install and launch

### Method 2: Open SDK Only

1. **Open Android Studio**

2. **Open Project**:
   - Click `File` → `Open`
   - Navigate to: `/Users/E2289/Documents/claudecode/storyly/android-sdk`
   - Click `Open`

3. This opens just the SDK library (no demo app)

## Prerequisites

Before running the demo:

### 1. Start Backend Server

```bash
cd /Users/E2289/Documents/claudecode/storyly/backend
npm run dev
```

Backend should be running on `http://localhost:3000`

### 2. Create API Key

1. Go to dashboard: `http://localhost:5173`
2. Navigate to Settings
3. Create a new API key
4. Copy the key

### 3. Configure Demo App

When you run the demo app:
1. Enter your API key in the text field
2. Click "Start Demo"
3. Click "Load Stories" to fetch from backend

## App Features

- **API Key Configuration**: Enter your backend API key
- **Story Loading**: Fetch stories from backend
- **Status Display**: Shows loading, error, or success states
- **Story Viewer**: Displays stories using StorylyView component

## Network Configuration

The app is configured for **Android Emulator**:
- Backend URL: `http://10.0.2.2:3000/api/v1`
- `10.0.2.2` is the special IP for emulator to access host machine's `localhost`

### For Physical Device

If testing on a real device, change the URL in `MainActivity.kt`:

```kotlin
StorylyConfig(
    baseUrl = "http://YOUR_COMPUTER_IP:3000/api/v1"
)
```

Find your computer's IP:
```bash
# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1

# The IP will look like: 192.168.1.x
```

## Project Structure

```
demo-app/
├── app/
│   ├── src/main/
│   │   ├── java/com/storyly/demo/
│   │   │   └── MainActivity.kt
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
├── settings.gradle.kts
└── build.gradle.kts
```

## Troubleshooting

### Gradle Sync Failed

```bash
# In demo-app directory
./gradlew clean build
```

### Cannot Connect to Backend

1. Verify backend is running:
   ```bash
   curl http://localhost:3000/health
   ```

2. Check emulator can reach host:
   ```bash
   # In Android Studio Terminal (while emulator running)
   adb shell
   ping 10.0.2.2
   ```

3. Ensure `usesCleartextTraffic="true"` in AndroidManifest.xml

### API Key Invalid

1. Verify API key exists in dashboard
2. Check it's marked as "Active"
3. Confirm platform is set to "Android"

### No Stories Showing

1. Create stories in the dashboard
2. Set status to "Published"
3. Click "Load Stories" in the app

## Screenshots

The demo app shows:
1. **Configuration Screen**: Enter API key
2. **Story Viewer**: Horizontal scrolling story list
3. **Status Card**: Loading/error/success states
4. **Instructions**: Setup guide

## Development

### Making Changes to SDK

1. Edit files in `android-sdk/storyly/src/main/java/com/storyly/sdk/`
2. Changes automatically reflect in demo app
3. Rebuild: `Build` → `Rebuild Project`

### Testing Integration

```kotlin
// In your own app, integrate like this:
val storyly = rememberStoryly(
    context = context,
    apiKey = "your-api-key",
    config = StorylyConfig(
        baseUrl = "https://your-backend.com/api/v1"
    )
)

StorylyView(storyly = storyly)
```

## Next Steps

1. **Customize UI**: Modify `StoryView.kt` in SDK
2. **Add Features**: Implement full story viewer with swipes
3. **Test Analytics**: Events are tracked automatically
4. **Offline Mode**: SDK caches stories for offline viewing

## Need Help?

- Check main README: `../README.md`
- SDK Documentation: `../android-sdk/README.md`
- Backend API: `../backend/README.md`
