# USB Debugging Setup - OnePlus Nord CE6 Lite + Mac

## Step 1: Enable Developer Options

1. Open **Settings** on your OnePlus phone
2. Scroll down and tap **About device**
3. Find **Build number** (usually at the bottom)
4. **Tap "Build number" 7 times rapidly**
   - You'll see a message: "You are now a developer!"
5. Go back to Settings
6. You should now see **System** → **Developer options**

## Step 2: Enable USB Debugging

1. Open **Settings** → **System** → **Developer options**
2. Toggle **ON** the switch at the top (if off)
3. Scroll down and enable:
   - ✅ **USB debugging** (MUST enable this)
   - ✅ **Install via USB** (optional, but recommended)
   - ✅ **USB debugging (Security settings)** (if available)

## Step 3: Connect USB Cable

1. Use a **good quality USB cable** (the one that came with your phone is best)
2. Connect OnePlus to Mac
3. On your OnePlus, you'll see a notification about USB connection
4. Tap the notification and select **"File Transfer"** or **"Transfer files"**
   - NOT "Charge only"
   - NOT "USB tethering"

## Step 4: Authorize Computer

1. A popup will appear on your phone: **"Allow USB debugging?"**
   - Computer RSA key fingerprint will be shown
2. Check **"Always allow from this computer"**
3. Tap **"Allow"** or **"OK"**

⚠️ **If popup doesn't appear:**
- Disconnect and reconnect USB cable
- Try a different USB port on your Mac
- Try toggling USB debugging OFF and ON again

## Step 5: Verify Connection

Open Terminal on Mac and run:
```bash
adb devices
```

You should see:
```
List of devices attached
XXXXXXXXXX    device
```

If you see "unauthorized" instead of "device", check your phone for the authorization popup.

## Step 6: Check Android Studio

1. Open Android Studio
2. Look at the device dropdown (top toolbar, near the Run button)
3. You should see your OnePlus device listed
4. If not there, click the dropdown and look for your device

## Troubleshooting

### Phone Not Showing in Android Studio?

**Try these in order:**

1. **Restart ADB:**
   ```bash
   adb kill-server
   adb start-server
   adb devices
   ```

2. **Revoke USB Debugging Authorization:**
   - Settings → Developer options → Revoke USB debugging authorizations
   - Disconnect and reconnect
   - Re-authorize when popup appears

3. **Check USB Cable:**
   - Try a different cable
   - Make sure it's a data cable, not charge-only

4. **Restart Both Devices:**
   - Restart your OnePlus phone
   - Restart Android Studio (or your Mac)

5. **Install Android Platform Tools (if needed):**
   ```bash
   brew install android-platform-tools
   ```

### Still Not Working?

Try USB debugging over WiFi:
1. Connect via USB first (even if not authorized)
2. Run: `adb tcpip 5555`
3. Find your phone's IP: Settings → About → Status → IP address
4. Run: `adb connect YOUR_PHONE_IP:5555`
5. Disconnect USB cable

## Running Your App

Once connected:
1. Click the **Run** button (green play ▶️) in Android Studio
2. Select your OnePlus device from the list
3. Wait for build and installation
4. App will launch automatically on your phone!

## Quick Reference

| Action | Command |
|--------|---------|
| List devices | `adb devices` |
| Restart ADB | `adb kill-server && adb start-server` |
| Install APK | `adb install app-debug.apk` |
| View logs | `adb logcat` |
| WiFi debug | `adb tcpip 5555 && adb connect IP:5555` |

---

**Last Updated:** 2026-09-17
