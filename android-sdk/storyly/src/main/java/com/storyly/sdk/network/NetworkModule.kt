package com.storyly.sdk.network

import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Network module for creating Retrofit instance
 */
object NetworkModule {

    fun createApiService(baseUrl: String, enableLogging: Boolean = false): StorylyApiService {
        val okHttpClient = createOkHttpClient(enableLogging)
        val retrofit = createRetrofit(baseUrl, okHttpClient)
        return retrofit.create(StorylyApiService::class.java)
    }

    private fun createOkHttpClient(enableLogging: Boolean): OkHttpClient {
        return OkHttpClient.Builder().apply {
            connectTimeout(30, TimeUnit.SECONDS)
            readTimeout(30, TimeUnit.SECONDS)
            writeTimeout(30, TimeUnit.SECONDS)

            if (enableLogging) {
                val loggingInterceptor = HttpLoggingInterceptor().apply {
                    level = HttpLoggingInterceptor.Level.BODY
                }
                addInterceptor(loggingInterceptor)
            }

            // Add retry interceptor
            addInterceptor { chain ->
                val request = chain.request()
                var response = chain.proceed(request)
                var tryCount = 0
                val maxRetries = 3

                while (!response.isSuccessful && tryCount < maxRetries) {
                    tryCount++
                    response.close()
                    Thread.sleep(1000L * tryCount) // Exponential backoff
                    response = chain.proceed(request)
                }

                response
            }
        }.build()
    }

    private fun createRetrofit(baseUrl: String, okHttpClient: OkHttpClient): Retrofit {
        val gson = GsonBuilder()
            .setLenient()
            .create()

        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
    }
}
