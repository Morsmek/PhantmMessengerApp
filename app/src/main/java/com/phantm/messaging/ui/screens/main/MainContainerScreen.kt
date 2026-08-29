package com.phantm.messaging.ui.screens.main

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.phantm.messaging.ui.components.PhantmBottomBar
import com.phantm.messaging.ui.components.PhantmTab
import com.phantm.messaging.ui.theme.BgPrimary
import com.phantm.messaging.ui.viewmodel.PhantmViewModel

@Composable
fun MainContainerScreen(
    viewModel: PhantmViewModel,
    onNavigateToChatDetail: (String, String) -> Unit,
    onNavigateToNewChat: () -> Unit,
    onNavigateToAddContact: () -> Unit,
    modifier: Modifier = Modifier
) {
    var currentTab by rememberSaveable { mutableStateOf(PhantmTab.CHATS) }

    val identity by viewModel.identity.collectAsState()
    val settings by viewModel.settings.collectAsState()
    val conversations by viewModel.filteredConversations.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val contacts by viewModel.contacts.collectAsState()
    val totalMessages by viewModel.totalMessages.collectAsState()
    val totalContacts by viewModel.totalContacts.collectAsState()

    Scaffold(
        bottomBar = {
            PhantmBottomBar(
                currentTab = currentTab,
                onTabSelected = { currentTab = it }
            )
        },
        containerColor = BgPrimary,
        contentWindowInsets = WindowInsets(0, 0, 0, 0),
        modifier = modifier
            .fillMaxSize()
            .windowInsetsPadding(WindowInsets.statusBars)
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (currentTab) {
                PhantmTab.CHATS -> {
                    ChatsListScreen(
                        conversations = conversations,
                        searchQuery = searchQuery,
                        onSearchQueryChange = { viewModel.setSearchQuery(it) },
                        onConversationClick = onNavigateToChatDetail,
                        onNewChatClick = onNavigateToNewChat
                    )
                }
                PhantmTab.CONTACTS -> {
                    ContactsListScreen(
                        publicKey = identity.publicKey,
                        contacts = contacts,
                        onContactClick = { id, name ->
                            val convId = viewModel.createConversation(id, name)
                            onNavigateToChatDetail(convId, name)
                        },
                        onAddContactClick = onNavigateToAddContact,
                        onRemoveContact = { viewModel.removeContact(it) },
                        onShowToast = { msg, type -> viewModel.showToast(msg, type) }
                    )
                }
                PhantmTab.PROFILE -> {
                    ProfileScreen(
                        displayName = identity.displayName,
                        publicKey = identity.publicKey,
                        mnemonic = identity.mnemonic,
                        totalMessages = totalMessages,
                        totalContacts = totalContacts,
                        onUpdateDisplayName = { viewModel.updateDisplayName(it) },
                        onShowToast = { msg, type -> viewModel.showToast(msg, type) }
                    )
                }
                PhantmTab.SETTINGS -> {
                    SettingsScreen(
                        settings = settings,
                        onToggleNotifications = { viewModel.toggleNotifications(it) },
                        onTogglePreview = { viewModel.togglePreview(it) },
                        onToggleAppLock = { viewModel.toggleAppLock(it) },
                        onSetAutoDeleteDays = { viewModel.setAutoDeleteDays(it) }
                    )
                }
            }
        }
    }
}
