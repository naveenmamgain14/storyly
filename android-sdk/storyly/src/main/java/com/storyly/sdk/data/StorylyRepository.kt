package com.storyly.sdk.data

import android.content.Context
import android.provider.Settings
import com.storyly.sdk.model.AnalyticsEvent
import com.storyly.sdk.model.EventType
import com.storyly.sdk.model.Story
import com.storyly.sdk.model.StorylyConfig
import com.storyly.sdk.network.NetworkModule
import com.storyly.sdk.network.StorylyApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.UUID

/**
 * Repository for managing story data and API communication
 */
class StorylyRepository(
    private val context: Context,
    private val apiKey: String,
    private val config: StorylyConfig
) {
    private val apiService: StorylyApiService = NetworkModule.createApiService(
        baseUrl = config.baseUrl,
        enableLogging = true // TODO: Make this configurable
    )

    private val deviceId: String by lazy {
        Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ANDROID_ID
        ) ?: UUID.randomUUID().toString()
    }

    private val sessionId: String = UUID.randomUUID().toString()

    /**
     * Fetch stories from the server
     */
    suspend fun fetchStories(): List<Story> = withContext(Dispatchers.IO) {
        try {
            val response = apiService.getStories(
                apiKey = apiKey,
                userId = config.userId
            )

            if (response.success && response.data != null) {
                // Cache stories if caching is enabled
                if (config.enableCache) {
                    cacheStories(response.data)
                }
                response.data
            } else {
                throw Exception(response.error ?: "Failed to fetch stories")
            }
        } catch (e: Exception) {
            // Try to load from cache if fetch fails
            if (config.enableCache) {
                getCachedStories()
            } else {
                throw e
            }
        }
    }

    /**
     * Track an analytics event
     */
    suspend fun trackEvent(
        eventType: String,
        storyId: String,
        itemId: String? = null,
        metadata: Map<String, Any>? = null
    ) {
        if (!config.enableAnalytics) return

        withContext(Dispatchers.IO) {
            try {
                val event = AnalyticsEvent(
                    eventType = EventType.valueOf(eventType.uppercase()),
                    storyId = storyId,
                    storyItemId = itemId,
                    userId = config.userId,
                    deviceId = deviceId,
                    sessionId = sessionId,
                    metadata = metadata
                )

                apiService.trackEvent(apiKey, event)
            } catch (e: Exception) {
                // Silently fail analytics to not affect user experience
                e.printStackTrace()
            }
        }
    }

    /**
     * Get cached stories (offline support)
     */
    suspend fun getCachedStories(): List<Story> = withContext(Dispatchers.IO) {
        // TODO: Implement Room database caching
        emptyList()
    }

    /**
     * Cache stories locally
     */
    private suspend fun cacheStories(stories: List<Story>) {
        // TODO: Implement Room database caching
    }
}
