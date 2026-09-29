package com.example.storyly

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.storyly.sdk.model.StorylyConfig
import com.storyly.sdk.rememberStoryly
import com.storyly.sdk.ui.StorylyView

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    StorylyDemoApp()
                }
            }
        }
    }
}

@Composable
fun StorylyDemoApp() {
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        Text(
            text = "Storyly Medicine App",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(top = 24.dp, bottom = 16.dp)
        )

        // Production Config Info
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer
            )
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "✅ Production Configuration",
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                Text(
                    text = "API Key: Medicine App",
                    style = MaterialTheme.typography.bodySmall
                )
                Text(
                    text = "Backend: Instapod Production",
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }

        // Storyly View
        Card(
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "Stories",
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                // Initialize Storyly with production config
                val storyly = rememberStoryly(
                    context = context,
                    apiKey = "sk_80a04e238f59d10ec6072aca8ad0cbcdead96cf2d32edf1c288e16c975216781",
                    config = StorylyConfig(
                        baseUrl = "https://storyly-dashboard.nbg1-2.instapods.app/api/v1/",
                        enableCache = true,
                        enableAnalytics = true
                    )
                )

                StorylyView(
                    storyly = storyly,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp)
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Status
                val storyCount = storyly.stories.size
                Text(
                    text = when {
                        storyly.isLoading -> "⏳ Loading stories..."
                        storyly.error != null -> "❌ Error: ${storyly.error}"
                        storyCount == 0 -> "📭 No stories yet. Create some in the dashboard!"
                        else -> "✅ $storyCount stories loaded"
                    },
                    style = MaterialTheme.typography.bodyMedium,
                    color = when {
                        storyly.error != null -> MaterialTheme.colorScheme.error
                        storyCount > 0 -> MaterialTheme.colorScheme.primary
                        else -> MaterialTheme.colorScheme.onSurface
                    }
                )
            }
        }

        // Instructions Card
        Card(
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "📝 Next Steps:",
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                Text(
                    text = """
                        1. Open dashboard at:
                           storyly-dashboard.nbg1-2.instapods.app

                        2. Login: demo@storyly.io / password123

                        3. Create and publish stories

                        4. Pull down to refresh this app
                    """.trimIndent(),
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
    }
}
