package com.storyly.demo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.storyly.sdk.Storyly
import com.storyly.sdk.model.StorylyConfig
import com.storyly.sdk.rememberStoryly
import com.storyly.sdk.ui.StorylyView
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            StorylyDemoTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    DemoScreen()
                }
            }
        }
    }
}

@Composable
fun DemoScreen() {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    // State for API key input
    var apiKey by remember { mutableStateOf("your-api-key-here") }
    var isConfigured by remember { mutableStateOf(false) }

    // Initialize Storyly when configured
    val storyly = if (isConfigured) {
        rememberStoryly(
            context = context,
            apiKey = apiKey,
            config = StorylyConfig(
                baseUrl = "http://10.0.2.2:3000/api/v1", // For Android Emulator
                enableCache = true,
                enableAnalytics = true,
                userId = "demo-user-123"
            ),
            autoLoad = false // We'll load manually
        )
    } else {
        null
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Header
        Text(
            text = "Storyly Demo",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(vertical = 24.dp)
        )

        if (!isConfigured) {
            // Configuration Screen
            ConfigurationScreen(
                apiKey = apiKey,
                onApiKeyChange = { apiKey = it },
                onStart = { isConfigured = true }
            )
        } else {
            // Story Viewer
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = "Stories",
                        style = MaterialTheme.typography.titleLarge,
                        modifier = Modifier.padding(bottom = 16.dp)
                    )

                    storyly?.let {
                        StorylyView(
                            storyly = it,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }

            // Load Stories Button
            Button(
                onClick = {
                    scope.launch {
                        storyly?.load()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
            ) {
                Text("Load Stories")
            }

            // Status Info
            storyly?.let {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "Status",
                            style = MaterialTheme.typography.titleMedium,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )

                        Text(
                            text = when {
                                it.isLoading -> "Loading stories..."
                                it.error != null -> "Error: ${it.error}"
                                it.stories.isEmpty() -> "No stories available"
                                else -> "${it.stories.size} stories loaded"
                            },
                            style = MaterialTheme.typography.bodyMedium,
                            color = when {
                                it.error != null -> MaterialTheme.colorScheme.error
                                else -> MaterialTheme.colorScheme.onSurface
                            }
                        )
                    }
                }
            }

            // Reconfigure Button
            Button(
                onClick = { isConfigured = false },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.secondary
                )
            ) {
                Text("Change API Key")
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        // Instructions
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
                    text = "Setup Instructions:",
                    style = MaterialTheme.typography.titleSmall,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                Text(
                    text = """
                        1. Start the backend: cd backend && npm run dev
                        2. Create an API key in the dashboard
                        3. Enter the API key above
                        4. Click "Start Demo"
                        5. Click "Load Stories" to fetch
                    """.trimIndent(),
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
    }
}

@Composable
fun ConfigurationScreen(
    apiKey: String,
    onApiKeyChange: (String) -> Unit,
    onStart: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Configure Storyly SDK",
            style = MaterialTheme.typography.titleLarge,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        OutlinedTextField(
            value = apiKey,
            onValueChange = onApiKeyChange,
            label = { Text("API Key") },
            placeholder = { Text("Enter your API key") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp),
            singleLine = true
        )

        Text(
            text = "Backend URL: http://10.0.2.2:3000/api/v1",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        Button(
            onClick = onStart,
            modifier = Modifier.fillMaxWidth(),
            enabled = apiKey.isNotBlank()
        ) {
            Text("Start Demo")
        }
    }
}

@Composable
fun StorylyDemoTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = lightColorScheme(),
        content = content
    )
}
