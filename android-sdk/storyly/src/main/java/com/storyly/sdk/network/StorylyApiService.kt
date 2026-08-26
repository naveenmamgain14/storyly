package com.storyly.sdk.network

import com.storyly.sdk.model.AnalyticsEvent
import com.storyly.sdk.model.ApiResponse
import com.storyly.sdk.model.Story
import com.storyly.sdk.model.StoryCollection
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Query

/**
 * Retrofit API service for Storyly backend
 */
interface StorylyApiService {

    /**
     * Fetch stories for the SDK
     */
    @GET("sdk/stories")
    suspend fun getStories(
        @Header("X-API-Key") apiKey: String,
        @Query("user_id") userId: String? = null,
        @Query("collection_id") collectionId: String? = null
    ): ApiResponse<List<Story>>

    /**
     * Fetch story collections
     */
    @GET("sdk/collections")
    suspend fun getCollections(
        @Header("X-API-Key") apiKey: String
    ): ApiResponse<List<StoryCollection>>

    /**
     * Track analytics event
     */
    @POST("sdk/analytics")
    suspend fun trackEvent(
        @Header("X-API-Key") apiKey: String,
        @Body event: AnalyticsEvent
    ): ApiResponse<Unit>

    /**
     * Batch track analytics events
     */
    @POST("sdk/analytics/batch")
    suspend fun trackEventsBatch(
        @Header("X-API-Key") apiKey: String,
        @Body events: List<AnalyticsEvent>
    ): ApiResponse<Unit>
}
