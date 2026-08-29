package com.phantm.messaging.ui.navigation

import android.net.Uri
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.phantm.messaging.ui.screens.main.AddContactScreen
import com.phantm.messaging.ui.screens.main.ChatDetailScreen
import com.phantm.messaging.ui.screens.main.MainContainerScreen
import com.phantm.messaging.ui.screens.main.NewChatScreen
import com.phantm.messaging.ui.screens.onboarding.PassphraseConfirmScreen
import com.phantm.messaging.ui.screens.onboarding.PassphraseScreen
import com.phantm.messaging.ui.screens.onboarding.PhantmIDScreen
import com.phantm.messaging.ui.screens.onboarding.RecoverScreen
import com.phantm.messaging.ui.screens.onboarding.WelcomeScreen
import com.phantm.messaging.ui.theme.AccentPink
import com.phantm.messaging.ui.theme.BgElevated
import com.phantm.messaging.ui.theme.ErrorRed
import com.phantm.messaging.ui.theme.SuccessGreen
import com.phantm.messaging.ui.theme.TextPrimary
import com.phantm.messaging.ui.viewmodel.PhantmViewModel

@Composable
fun PhantmNavGraph(
    viewModel: PhantmViewModel,
    isOnboarded: Boolean,
    modifier: Modifier = Modifier
) {
    val navController = rememberNavController()
    val toastData by viewModel.toast.collectAsState()

    val startDest = if (isOnboarded) "main" else "welcome"

    Box(modifier = modifier.fillMaxSize()) {
        NavHost(
            navController = navController,
            startDestination = startDest,
            modifier = Modifier.fillMaxSize()
        ) {
            // Onboarding Routes
            composable("welcome") {
                WelcomeScreen(
                    onCreateIdentity = {
                        viewModel.startNewIdentityGeneration()
                        navController.navigate("phantm_id")
                    },
                    onRecoverIdentity = {
                        navController.navigate("recover")
                    }
                )
            }

            composable("phantm_id") {
                val pubKey by viewModel.pendingPublicKey.collectAsState()
                PhantmIDScreen(
                    publicKey = pubKey,
                    onContinue = { navController.navigate("passphrase") },
                    onShowToast = { msg, type -> viewModel.showToast(msg, type) }
                )
            }

            composable("passphrase") {
                val mnemonic by viewModel.pendingMnemonic.collectAsState()
                val isChecked by viewModel.passphraseChecked.collectAsState()

                PassphraseScreen(
                    mnemonic = mnemonic,
                    isChecked = isChecked,
                    onCheckedChange = { viewModel.setPassphraseChecked(it) },
                    onContinue = { navController.navigate("passphrase_confirm") },
                    onShowToast = { msg, type -> viewModel.showToast(msg, type) }
                )
            }

            composable("passphrase_confirm") {
                val currentRound by viewModel.currentQuizRound.collectAsState()
                val roundIndex by viewModel.currentRoundIndex.collectAsState()
                val selectedOption by viewModel.selectedQuizOption.collectAsState()
                val feedback by viewModel.quizFeedback.collectAsState()
                val isComplete by viewModel.quizCompleted.collectAsState()

                PassphraseConfirmScreen(
                    currentRound = currentRound,
                    roundIndex = roundIndex,
                    selectedOption = selectedOption,
                    feedback = feedback,
                    isComplete = isComplete,
                    onOptionSelected = { option ->
                        viewModel.selectQuizOption(option) {
                            navController.navigate("main") {
                                popUpTo("welcome") { inclusive = true }
                            }
                        }
                    },
                    onFinished = {
                        navController.navigate("main") {
                            popUpTo("welcome") { inclusive = true }
                        }
                    }
                )
            }

            composable("recover") {
                val recoverInput by viewModel.recoverInput.collectAsState()
                RecoverScreen(
                    input = recoverInput,
                    onInputChange = { viewModel.setRecoverInput(it) },
                    onRecover = {
                        viewModel.recoverIdentity {
                            navController.navigate("main") {
                                popUpTo("welcome") { inclusive = true }
                            }
                        }
                    },
                    onBack = { navController.popBackStack() }
                )
            }

            // Main App Container
            composable("main") {
                MainContainerScreen(
                    viewModel = viewModel,
                    onNavigateToChatDetail = { convId, contactName ->
                        val encodedName = Uri.encode(contactName)
                        navController.navigate("chat_detail/$convId/$encodedName")
                    },
                    onNavigateToNewChat = { navController.navigate("new_chat") },
                    onNavigateToAddContact = { navController.navigate("add_contact") }
                )
            }

            // Chat Detail
            composable(
                route = "chat_detail/{convId}/{contactName}",
                arguments = listOf(
                    navArgument("convId") { type = NavType.StringType },
                    navArgument("contactName") { type = NavType.StringType }
                )
            ) { backStackEntry ->
                val convId = backStackEntry.arguments?.getString("convId") ?: ""
                val contactName = Uri.decode(backStackEntry.arguments?.getString("contactName") ?: "Contact")
                val messages by viewModel.getMessagesForConversation(convId).collectAsState()

                ChatDetailScreen(
                    conversationId = convId,
                    contactName = contactName,
                    messages = messages,
                    onSendMessage = { text -> viewModel.sendMessage(convId, contactName, text) },
                    onDeleteMessage = { msgId -> viewModel.deleteMessage(msgId) },
                    onDeleteConversation = { viewModel.deleteConversation(convId) },
                    onBack = { navController.popBackStack() },
                    onShowToast = { msg, type -> viewModel.showToast(msg, type) }
                )
            }

            // New Chat Screen
            composable("new_chat") {
                val contacts by viewModel.contacts.collectAsState()
                NewChatScreen(
                    contacts = contacts,
                    onSelectContact = { contactId, name ->
                        val convId = viewModel.createConversation(contactId, name)
                        val encodedName = Uri.encode(name)
                        navController.navigate("chat_detail/$convId/$encodedName") {
                            popUpTo("new_chat") { inclusive = true }
                        }
                    },
                    onAddContact = {
                        navController.navigate("add_contact") {
                            popUpTo("new_chat") { inclusive = true }
                        }
                    },
                    onClose = { navController.popBackStack() }
                )
            }

            // Add Contact Screen
            composable("add_contact") {
                AddContactScreen(
                    onAddContact = { id, name -> viewModel.addContact(id, name) },
                    onBack = { navController.popBackStack() }
                )
            }
        }

        // Global Animated Toast Notification Overlay
        AnimatedVisibility(
            visible = toastData != null,
            enter = fadeIn() + slideInVertically { -it },
            exit = fadeOut() + slideOutVertically { -it },
            modifier = Modifier
                .align(Alignment.TopCenter)
                .windowInsetsPadding(WindowInsets.statusBars)
                .padding(top = 16.dp, start = 20.dp, end = 20.dp)
        ) {
            toastData?.let { toast ->
                val (icon, color) = when (toast.type) {
                    "success" -> Icons.Default.CheckCircle to SuccessGreen
                    "error" -> Icons.Default.Error to ErrorRed
                    else -> Icons.Default.Info to AccentPink
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(24.dp))
                        .background(BgElevated)
                        .border(1.dp, color.copy(alpha = 0.5f), RoundedCornerShape(24.dp))
                        .shadow(12.dp, RoundedCornerShape(24.dp), spotColor = color)
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = toast.type,
                        tint = color,
                        modifier = Modifier.size(18.dp)
                    )
                    Text(
                        text = toast.message,
                        color = TextPrimary,
                        fontSize = 13.sp,
                        modifier = Modifier.padding(start = 8.dp)
                    )
                }
            }
        }
    }
}
