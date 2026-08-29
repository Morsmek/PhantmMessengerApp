package com.phantm.messaging.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

@Serializable
@Entity(tableName = "conversations")
data class ConversationEntity(
    @PrimaryKey val id: String, // Contact ID / address
    val contactName: String,
    val lastMessageAt: Long,
    val lastMessagePreview: String = "",
    val unreadCount: Int = 0
)

@Serializable
@Entity(tableName = "messages")
data class MessageEntity(
    @PrimaryKey val id: String,
    val conversationId: String,
    val content: String,
    val timestamp: Long,
    val isSent: Boolean,
    val status: String = "delivered" // "sent" | "delivered"
)

@Serializable
@Entity(tableName = "contacts")
data class ContactEntity(
    @PrimaryKey val id: String, // 64 hex characters
    val name: String,
    val addedAt: Long,
    val isVerified: Boolean = true
)

data class UserIdentity(
    val mnemonic: String = "",
    val publicKey: String = "",
    val displayName: String = "Anon",
    val isOnboarded: Boolean = false
)

data class UserSettings(
    val notificationsEnabled: Boolean = true,
    val showNotificationPreview: Boolean = true,
    val appLockEnabled: Boolean = false,
    val autoDeleteDays: Int? = null // null means never
)
