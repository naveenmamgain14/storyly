package com.storyly.sdk

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.storyly.sdk.data.StorylyRepository
import com.storyly.sdk.model.Story
import com.storyly.sdk.model.StorylyConfig

/**
 * Main entry point for the Storyly SDK
 *
 * Usage:
 * ```
 * val storyly = Storyly(context, "your-api-key")
 * storyly.load()
 *
 * StorylyView(storyly = storyly)
 * ```
 */
class Storyly(
    private val context: Context,
    private val apiKey: String,
    private val config: StorylyConfig = StorylyConfig()
) {
    private val repository = StorylyRepository(context, apiKey, config)

    var stories by mutableStateOf<List<Story>>(emptyList())
        private set

    var isLoading by mutableStateOf(false)
        private set

    var error by mutableStateOf<String?>(null)
        private set

    /**
     * Load stories from the server
     */
    suspend fun load() {
        isLoading = true
        error = null

        try {
            stories = repository.fetchStories()
        } catch (e: Exception) {
            error = e.message ?: "Failed to load stories"
        } finally {
            isLoading = false
        }
    }

    /**
     * Track analytics event
     */
    internal suspend fun trackEvent(
        eventType: String,
        storyId: String,
        itemId: String? = null,
        metadata: Map<String, Any>? = null
    ) {
        repository.trackEvent(eventType, storyId, itemId, metadata)
    }

    /**
     * Get cached stories (offline support)
     */
    suspend fun getCachedStories(): List<Story> {
        return repository.getCachedStories()
    }
}

/**
 * Composable function to automatically load stories
 */
@Composable
fun rememberStoryly(
    context: Context,
    apiKey: String,
    config: StorylyConfig = StorylyConfig(),
    autoLoad: Boolean = true
): Storyly {
    val storyly = remember(apiKey) {
        Storyly(context, apiKey, config)
    }

    if (autoLoad) {
        LaunchedEffect(apiKey) {
            storyly.load()
        }
    }

    return storyly
}
