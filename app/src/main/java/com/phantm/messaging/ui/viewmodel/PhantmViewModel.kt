package com.phantm.messaging.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.phantm.messaging.data.crypto.Bip39Helper
import com.phantm.messaging.data.local.AppDatabase
import com.phantm.messaging.data.local.PreferencesManager
import com.phantm.messaging.data.model.ContactEntity
import com.phantm.messaging.data.model.ConversationEntity
import com.phantm.messaging.data.model.MessageEntity
import com.phantm.messaging.data.model.UserIdentity
import com.phantm.messaging.data.model.UserSettings
import com.phantm.messaging.data.repository.PhantmRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlin.random.Random

data class QuizRound(
    val wordIndex: Int, // 1-based (e.g. 7 for "Word #7")
    val correctWord: String,
    val options: List<String>
)

data class ToastData(
    val message: String,
    val type: String = "info" // "success" | "error" | "info"
)

class PhantmViewModel(application: Application) : AndroidViewModel(application) {
    private val db = AppDatabase.getDatabase(application)
    private val preferences = PreferencesManager(application)
    private val repository = PhantmRepository(db, preferences)

    val identity: StateFlow<UserIdentity> = repository.identity
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), UserIdentity())

    val settings: StateFlow<UserSettings> = repository.settings
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), UserSettings())

    val contacts: StateFlow<List<ContactEntity>> = repository.contacts
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val totalMessages: StateFlow<Int> = repository.totalMessageCount
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val totalContacts: StateFlow<Int> = repository.totalContactCount
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val conversations: StateFlow<List<ConversationEntity>> = repository.conversations
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Search query for conversations
    private val _searchQuery = MutableStateFlow("")
    val searchQuery = _searchQuery.asStateFlow()

    val filteredConversations: StateFlow<List<ConversationEntity>> = combine(
        conversations,
        _searchQuery
    ) { list, query ->
        if (query.isBlank()) list
        else list.filter {
            it.contactName.contains(query, ignoreCase = true) ||
            it.lastMessagePreview.contains(query, ignoreCase = true)
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Toast state
    private val _toast = MutableStateFlow<ToastData?>(null)
    val toast = _toast.asStateFlow()

    // Onboarding in-progress states
    private val _pendingMnemonic = MutableStateFlow("")
    val pendingMnemonic = _pendingMnemonic.asStateFlow()

    private val _pendingPublicKey = MutableStateFlow("")
    val pendingPublicKey = _pendingPublicKey.asStateFlow()

    private val _passphraseChecked = MutableStateFlow(false)
    val passphraseChecked = _passphraseChecked.asStateFlow()

    // Verification quiz state (3 rounds)
    private val _quizRounds = MutableStateFlow<List<QuizRound>>(emptyList())
    private val _currentRoundIndex = MutableStateFlow(0)
    val currentRoundIndex = _currentRoundIndex.asStateFlow()

    private val _selectedQuizOption = MutableStateFlow<String?>(null)
    val selectedQuizOption = _selectedQuizOption.asStateFlow()

    private val _quizFeedback = MutableStateFlow<Boolean?>(null) // true=correct, false=wrong, null=idle
    val quizFeedback = _quizFeedback.asStateFlow()

    private val _quizCompleted = MutableStateFlow(false)
    val quizCompleted = _quizCompleted.asStateFlow()

    // Current quiz round
    val currentQuizRound: StateFlow<QuizRound?> = combine(
        _quizRounds,
        _currentRoundIndex
    ) { rounds, index ->
        rounds.getOrNull(index)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // Recovery Screen State
    private val _recoverInput = MutableStateFlow("")
    val recoverInput = _recoverInput.asStateFlow()

    fun showToast(message: String, type: String = "info") {
        viewModelScope.launch {
            _toast.value = ToastData(message, type)
            delay(2400)
            if (_toast.value?.message == message) {
                _toast.value = null
            }
        }
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun startNewIdentityGeneration() {
        val mnemonic = Bip39Helper.generateMnemonic(20)
        val pubKey = Bip39Helper.generateKeyPair(mnemonic)
        _pendingMnemonic.value = mnemonic
        _pendingPublicKey.value = pubKey
        _passphraseChecked.value = false
        _quizCompleted.value = false
        _currentRoundIndex.value = 0
        _selectedQuizOption.value = null
        _quizFeedback.value = null

        // Generate 3 random quiz rounds
        val words = mnemonic.split(" ")
        val indices = words.indices.shuffled().take(3)
        val rounds = indices.map { idx ->
            val correct = words[idx]
            val wrongCandidates = words.filter { it != correct }.shuffled().take(3)
            val allOptions = (wrongCandidates + correct).shuffled()
            QuizRound(
                wordIndex = idx + 1,
                correctWord = correct,
                options = allOptions
            )
        }
        _quizRounds.value = rounds
    }

    fun setPassphraseChecked(checked: Boolean) {
        _passphraseChecked.value = checked
    }

    fun selectQuizOption(option: String, onFinished: () -> Unit) {
        val round = currentQuizRound.value ?: return
        _selectedQuizOption.value = option
        val isCorrect = option.equals(round.correctWord, ignoreCase = true)
        _quizFeedback.value = isCorrect

        viewModelScope.launch {
            if (isCorrect) {
                delay(700)
                val nextIndex = _currentRoundIndex.value + 1
                if (nextIndex < _quizRounds.value.size) {
                    _currentRoundIndex.value = nextIndex
                    _selectedQuizOption.value = null
                    _quizFeedback.value = null
                } else {
                    _quizCompleted.value = true
                    // Save identity!
                    repository.saveIdentity(
                        mnemonic = _pendingMnemonic.value,
                        publicKey = _pendingPublicKey.value,
                        displayName = "Anon"
                    )
                    delay(1200)
                    onFinished()
                }
            } else {
                delay(900)
                _selectedQuizOption.value = null
                _quizFeedback.value = null
            }
        }
    }

    fun setRecoverInput(input: String) {
        _recoverInput.value = input
    }

    fun recoverIdentity(onSuccess: () -> Unit) {
        val words = _recoverInput.value.trim().lowercase().split("\\s+".toRegex()).filter { it.isNotBlank() }
        if (words.size != 20 || !words.all { Bip39Helper.isValidWord(it) }) {
            showToast("Please enter 20 valid BIP39 words", "error")
            return
        }
        val mnemonic = words.joinToString(" ")
        val pubKey = Bip39Helper.generateKeyPair(mnemonic)
        viewModelScope.launch {
            repository.saveIdentity(mnemonic, pubKey, "Anon")
            showToast("Identity recovered successfully", "success")
            onSuccess()
        }
    }

    fun updateDisplayName(name: String) {
        viewModelScope.launch {
            repository.setDisplayName(name)
            showToast("Display name updated", "success")
        }
    }

    fun addContact(id: String, name: String?): Boolean {
        val cleanId = id.removePrefix("phantm://").trim().lowercase()
        val isValid = cleanId.length == 64 && cleanId.all { it in "0123456789abcdef" }
        if (!isValid) {
            showToast("Invalid 64-hex Phantm ID", "error")
            return false
        }
        viewModelScope.launch {
            val success = repository.addContact(cleanId, name)
            if (success) {
                showToast("Contact added", "success")
            } else {
                showToast("Contact already exists", "error")
            }
        }
        return true
    }

    fun removeContact(id: String) {
        viewModelScope.launch {
            repository.removeContact(id)
            showToast("Contact removed", "info")
        }
    }

    fun createConversation(contactId: String, name: String): String {
        viewModelScope.launch {
            repository.createConversation(contactId, name)
        }
        return contactId
    }

    fun sendMessage(conversationId: String, contactName: String, content: String) {
        if (content.isBlank()) return
        viewModelScope.launch {
            repository.sendMessage(conversationId, contactName, content.trim())
        }
    }

    fun deleteConversation(id: String) {
        viewModelScope.launch {
            repository.deleteConversation(id)
            showToast("Conversation deleted", "info")
        }
    }

    fun deleteMessage(id: String) {
        viewModelScope.launch {
            repository.deleteMessage(id)
            showToast("Message deleted", "info")
        }
    }

    fun getMessagesForConversation(convId: String): StateFlow<List<MessageEntity>> {
        return repository.getMessages(convId)
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    }

    fun toggleNotifications(enabled: Boolean) {
        viewModelScope.launch {
            repository.toggleNotifications(enabled)
        }
    }

    fun togglePreview(enabled: Boolean) {
        viewModelScope.launch {
            repository.togglePreview(enabled)
        }
    }

    fun toggleAppLock(enabled: Boolean) {
        viewModelScope.launch {
            repository.toggleAppLock(enabled)
        }
    }

    fun setAutoDeleteDays(days: Int?) {
        viewModelScope.launch {
            repository.setAutoDeleteDays(days)
        }
    }
}
