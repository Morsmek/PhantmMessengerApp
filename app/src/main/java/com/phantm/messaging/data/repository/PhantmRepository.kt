package com.phantm.messaging.data.repository

import com.phantm.messaging.data.crypto.Bip39Helper
import com.phantm.messaging.data.local.AppDatabase
import com.phantm.messaging.data.local.PreferencesManager
import com.phantm.messaging.data.model.ContactEntity
import com.phantm.messaging.data.model.ConversationEntity
import com.phantm.messaging.data.model.MessageEntity
import com.phantm.messaging.data.model.UserIdentity
import com.phantm.messaging.data.model.UserSettings
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch
import java.util.UUID

class PhantmRepository(
    private val database: AppDatabase,
    private val preferences: PreferencesManager
) {
    private val chatDao = database.chatDao()
    private val contactDao = database.contactDao()
    private val scope = CoroutineScope(Dispatchers.IO)

    val identity: Flow<UserIdentity> = preferences.userIdentityFlow
    val settings: Flow<UserSettings> = preferences.userSettingsFlow

    val conversations: Flow<List<ConversationEntity>> = chatDao.getConversations()
    val contacts: Flow<List<ContactEntity>> = contactDao.getContacts()
    val totalMessageCount: Flow<Int> = chatDao.getTotalMessageCount()
    val totalContactCount: Flow<Int> = contactDao.getContactCount()

    fun getMessages(conversationId: String): Flow<List<MessageEntity>> {
        return chatDao.getMessages(conversationId)
    }

    fun getConversation(id: String): Flow<ConversationEntity?> {
        return chatDao.getConversation(id)
    }

    fun getContact(id: String): Flow<ContactEntity?> {
        return contactDao.getContact(id)
    }

    suspend fun saveIdentity(mnemonic: String, publicKey: String, displayName: String = "Ghost") {
        preferences.saveIdentity(mnemonic, publicKey, displayName)
    }

    suspend fun setDisplayName(name: String) {
        preferences.setDisplayName(name)
    }

    suspend fun toggleNotifications(enabled: Boolean) {
        preferences.toggleNotifications(enabled)
    }

    suspend fun togglePreview(enabled: Boolean) {
        preferences.togglePreview(enabled)
    }

    suspend fun toggleAppLock(enabled: Boolean) {
        preferences.toggleAppLock(enabled)
    }

    suspend fun setAutoDeleteDays(days: Int?) {
        preferences.setAutoDeleteDays(days)
    }

    suspend fun addContact(id: String, name: String?): Boolean {
        val cleanId = id.removePrefix("phantm://").trim().lowercase()
        if (cleanId.length != 64 || !cleanId.all { it in "0123456789abcdef" }) {
            return false
        }
        val fallbackName = "User ${cleanId.take(4)}...${cleanId.takeLast(4)}"
        val contact = ContactEntity(
            id = cleanId,
            name = if (name.isNullOrBlank()) fallbackName else name.trim(),
            addedAt = System.currentTimeMillis()
        )
        contactDao.insertContact(contact)
        return true
    }

    suspend fun removeContact(id: String) {
        contactDao.deleteContact(id)
    }

    suspend fun createConversation(contactId: String, name: String): String {
        val existingConv = ConversationEntity(
            id = contactId,
            contactName = name,
            lastMessageAt = System.currentTimeMillis(),
            lastMessagePreview = "",
            unreadCount = 0
        )
        chatDao.insertConversation(existingConv)
        return contactId
    }

    suspend fun sendMessage(conversationId: String, contactName: String, content: String) {
        val messageId = UUID.randomUUID().toString()
        val now = System.currentTimeMillis()
        val msg = MessageEntity(
            id = messageId,
            conversationId = conversationId,
            content = content,
            timestamp = now,
            isSent = true,
            status = "sent"
        )
        chatDao.insertMessage(msg)

        val conv = ConversationEntity(
            id = conversationId,
            contactName = contactName,
            lastMessageAt = now,
            lastMessagePreview = content,
            unreadCount = 0
        )
        chatDao.insertConversation(conv)

        // Simulate delivery status confirmation
        scope.launch {
            delay(500)
            chatDao.updateMessage(msg.copy(status = "delivered"))
        }
    }

    suspend fun deleteConversation(id: String) {
        chatDao.deleteConversation(id)
        chatDao.deleteMessagesForConversation(id)
    }

    suspend fun deleteMessage(id: String) {
        chatDao.deleteMessage(id)
    }

    suspend fun seedInitialDataIfNeeded(myPublicKey: String) {
        // Optional default secure contact if none exist
    }
}
