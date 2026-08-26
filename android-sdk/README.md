# Storyly Android SDK

Modern Android SDK for displaying Instagram/TikTok-style stories in your app.

## Features

- 📱 Full-screen story viewing experience
- 🎨 Built with Jetpack Compose
- 🎥 Support for images and videos
- 📊 Built-in analytics tracking
- 💾 Offline caching support
- 🎯 Simple integration

## Requirements

- Android SDK 24+ (Android 7.0+)
- Kotlin 1.9.20+
- Jetpack Compose

## Installation

### Gradle (Module level)

```kotlin
dependencies {
    implementation(project(":storyly"))
}
```

## Quick Start

### 1. Initialize Storyly

```kotlin
import com.storyly.sdk.Storyly
import com.storyly.sdk.model.StorylyConfig
import com.storyly.sdk.ui.StorylyView

// In your Composable
@Composable
fun MyScreen() {
    val context = LocalContext.current
    
    val storyly = rememberStoryly(
        context = context,
        apiKey = "your-api-key-here",
        config = StorylyConfig(
            baseUrl = "https://your-backend.com/api/v1",
            userId = "user-123"
        )
    )
    
    StorylyView(storyly = storyly)
}
```

### 2. Manual Loading

```kotlin
val storyly = remember {
    Storyly(
        context = context,
        apiKey = "your-api-key"
    )
}

LaunchedEffect(Unit) {
    storyly.load()
}

StorylyView(storyly = storyly)
```

## Configuration

### StorylyConfig Options

```kotlin
StorylyConfig(
    baseUrl = "https://api.yourapp.com/api/v1",  // Your backend URL
    enableCache = true,                           // Enable offline caching
    cacheDuration = 24 * 60 * 60 * 1000,         // 24 hours
    enableAnalytics = true,                       // Track user interactions
    userId = "user-123",                          // Optional user identifier
    customMetadata = mapOf("key" to "value")     // Custom metadata
)
```

## Architecture

- **MVVM Pattern**: Clean architecture with ViewModel
- **Jetpack Compose**: Modern UI toolkit
- **Retrofit**: REST API communication
- **Coil**: Efficient image loading
- **ExoPlayer**: Smooth video playback
- **Room**: Local data persistence

## API Integration

The SDK expects your backend to implement the following endpoints:

### Get Stories
```
GET /api/v1/sdk/stories
Headers: X-API-Key: your-api-key
```

### Track Analytics
```
POST /api/v1/sdk/analytics
Headers: X-API-Key: your-api-key
Body: AnalyticsEvent
```

## Building the SDK

```bash
./gradlew :storyly:assembleRelease
```

## License

Proprietary
