package com.storyly.sdk.model

import com.google.gson.annotations.SerializedName

/**
 * Configuration for Storyly SDK
 */
data class StorylyConfig(
    val baseUrl: String = "http://10.0.2.2:3000/api/v1", // Android emulator localhost
    val enableCache: Boolean = true,
    val cacheDuration: Long = 24 * 60 * 60 * 1000, // 24 hours
    val enableAnalytics: Boolean = true,
    val userId: String? = null,
    val customMetadata: Map<String, String> = emptyMap()
)

/**
 * Represents a collection of story items
 */
data class Story(
    @SerializedName("id")
    val id: String,

    @SerializedName("title")
    val title: String,

    @SerializedName("description")
    val description: String? = null,

    @SerializedName("collection_id")
    val collectionId: String? = null,

    @SerializedName("items")
    val items: List<StoryItem>,

    @SerializedName("thumbnail_url")
    val thumbnailUrl: String? = null,

    @SerializedName("published_at")
    val publishedAt: String,

    @SerializedName("order")
    val order: Int = 0
)

/**
 * Individual story item (slide)
 */
data class StoryItem(
    @SerializedName("id")
    val id: String,

    @SerializedName("story_id")
    val storyId: String,

    @SerializedName("type")
    val type: StoryItemType,

    @SerializedName("media_url")
    val mediaUrl: String,

    @SerializedName("thumbnail_url")
    val thumbnailUrl: String? = null,

    @SerializedName("duration")
    val duration: Int = 5, // seconds

    @SerializedName("action_url")
    val actionUrl: String? = null,

    @SerializedName("action_text")
    val actionText: String? = null,

    @SerializedName("order")
    val order: Int = 0
)

/**
 * Type of story item
 */
enum class StoryItemType {
    @SerializedName("image")
    IMAGE,

    @SerializedName("video")
    VIDEO
}

/**
 * Analytics event
 */
data class AnalyticsEvent(
    @SerializedName("event_type")
    val eventType: EventType,

    @SerializedName("story_id")
    val storyId: String,

    @SerializedName("story_item_id")
    val storyItemId: String? = null,

    @SerializedName("user_id")
    val userId: String? = null,

    @SerializedName("device_id")
    val deviceId: String,

    @SerializedName("session_id")
    val sessionId: String,

    @SerializedName("timestamp")
    val timestamp: Long = System.currentTimeMillis(),

    @SerializedName("metadata")
    val metadata: Map<String, Any>? = null
)

/**
 * Types of analytics events
 */
enum class EventType {
    @SerializedName("impression")
    IMPRESSION,  // Story shown in feed

    @SerializedName("view")
    VIEW,        // Story opened

    @SerializedName("click")
    CLICK,       // Action button clicked

    @SerializedName("complete")
    COMPLETE,    // Story completed

    @SerializedName("dismiss")
    DISMISS      // Story dismissed
}

/**
 * Story collection/group
 */
data class StoryCollection(
    @SerializedName("id")
    val id: String,

    @SerializedName("name")
    val name: String,

    @SerializedName("description")
    val description: String? = null,

    @SerializedName("icon_url")
    val iconUrl: String? = null,

    @SerializedName("stories")
    val stories: List<Story>,

    @SerializedName("order")
    val order: Int = 0
)

/**
 * API Response wrapper
 */
data class ApiResponse<T>(
    @SerializedName("success")
    val success: Boolean,

    @SerializedName("data")
    val data: T? = null,

    @SerializedName("error")
    val error: String? = null,

    @SerializedName("message")
    val message: String? = null
)
