package com.phantm.messaging

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.phantm.messaging.ui.navigation.PhantmNavGraph
import com.phantm.messaging.ui.theme.BgPrimary
import com.phantm.messaging.ui.theme.PhantmTheme
import com.phantm.messaging.ui.viewmodel.PhantmViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: PhantmViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            PhantmTheme {
                val identity by viewModel.identity.collectAsState()

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = BgPrimary
                ) {
                    PhantmNavGraph(
                        viewModel = viewModel,
                        isOnboarded = identity.isOnboarded
                    )
                }
            }
        }
    }
}
