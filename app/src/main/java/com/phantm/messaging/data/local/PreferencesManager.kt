package com.phantm.messaging.data.local

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.phantm.messaging.data.model.UserIdentity
import com.phantm.messaging.data.model.UserSettings
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore by preferencesDataStore(name = "phantm_preferences")

class PreferencesManager(private val context: Context) {

    companion object {
        val KEY_IS_ONBOARDED = booleanPreferencesKey("is_onboarded")
        val KEY_MNEMONIC = stringPreferencesKey("mnemonic")
        val KEY_PUBLIC_KEY = stringPreferencesKey("public_key")
        val KEY_DISPLAY_NAME = stringPreferencesKey("display_name")
        
        val KEY_NOTIFICATIONS_ENABLED = booleanPreferencesKey("notifications_enabled")
        val KEY_SHOW_NOTIFICATION_PREVIEW = booleanPreferencesKey("show_notification_preview")
        val KEY_APP_LOCK_ENABLED = booleanPreferencesKey("app_lock_enabled")
        val KEY_AUTO_DELETE_DAYS = intPreferencesKey("auto_delete_days")
    }

    val userIdentityFlow: Flow<UserIdentity> = context.dataStore.data.map { prefs ->
        UserIdentity(
            mnemonic = prefs[KEY_MNEMONIC] ?: "",
            publicKey = prefs[KEY_PUBLIC_KEY] ?: "",
            displayName = prefs[KEY_DISPLAY_NAME] ?: "Ghost",
            isOnboarded = prefs[KEY_IS_ONBOARDED] ?: false
        )
    }

    val userSettingsFlow: Flow<UserSettings> = context.dataStore.data.map { prefs ->
        val autoDelete = prefs[KEY_AUTO_DELETE_DAYS]
        UserSettings(
            notificationsEnabled = prefs[KEY_NOTIFICATIONS_ENABLED] ?: true,
            showNotificationPreview = prefs[KEY_SHOW_NOTIFICATION_PREVIEW] ?: true,
            appLockEnabled = prefs[KEY_APP_LOCK_ENABLED] ?: false,
            autoDeleteDays = if (autoDelete == null || autoDelete == -1) null else autoDelete
        )
    }

    suspend fun saveIdentity(mnemonic: String, publicKey: String, displayName: String = "Ghost") {
        context.dataStore.edit { prefs ->
            prefs[KEY_MNEMONIC] = mnemonic
            prefs[KEY_PUBLIC_KEY] = publicKey
            prefs[KEY_DISPLAY_NAME] = displayName
            prefs[KEY_IS_ONBOARDED] = true
        }
    }

    suspend fun setDisplayName(name: String) {
        context.dataStore.edit { prefs ->
            prefs[KEY_DISPLAY_NAME] = name
        }
    }

    suspend fun toggleNotifications(enabled: Boolean) {
        context.dataStore.edit { prefs ->
            prefs[KEY_NOTIFICATIONS_ENABLED] = enabled
        }
    }

    suspend fun togglePreview(enabled: Boolean) {
        context.dataStore.edit { prefs ->
            prefs[KEY_SHOW_NOTIFICATION_PREVIEW] = enabled
        }
    }

    suspend fun toggleAppLock(enabled: Boolean) {
        context.dataStore.edit { prefs ->
            prefs[KEY_APP_LOCK_ENABLED] = enabled
        }
    }

    suspend fun setAutoDeleteDays(days: Int?) {
        context.dataStore.edit { prefs ->
            if (days == null) {
                prefs[KEY_AUTO_DELETE_DAYS] = -1
            } else {
                prefs[KEY_AUTO_DELETE_DAYS] = days
            }
        }
    }

    suspend fun clearIdentity() {
        context.dataStore.edit { prefs ->
            prefs.clear()
        }
    }
}
