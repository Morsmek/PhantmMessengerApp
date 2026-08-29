package com.phantm.messaging.ui.screens.main

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Palette
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.phantm.messaging.data.model.UserSettings
import com.phantm.messaging.ui.theme.AccentPink
import com.phantm.messaging.ui.theme.BgElevated
import com.phantm.messaging.ui.theme.BgPrimary
import com.phantm.messaging.ui.theme.BgSurface
import com.phantm.messaging.ui.theme.BorderSubtle
import com.phantm.messaging.ui.theme.TextMuted
import com.phantm.messaging.ui.theme.TextPrimary
import com.phantm.messaging.ui.theme.TextSecondary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    settings: UserSettings,
    onToggleNotifications: (Boolean) -> Unit,
    onTogglePreview: (Boolean) -> Unit,
    onToggleAppLock: (Boolean) -> Unit,
    onSetAutoDeleteDays: (Int?) -> Unit,
    modifier: Modifier = Modifier
) {
    var showAutoDeleteSheet by remember { mutableStateOf(false) }
    var showPrivacyDialog by remember { mutableStateOf(false) }
    var showLicensesDialog by remember { mutableStateOf(false) }

    val autoDeleteLabel = when (settings.autoDeleteDays) {
        null, 0 -> "Never"
        1 -> "24 Hours"
        7 -> "7 Days"
        30 -> "30 Days"
        else -> "${settings.autoDeleteDays} Days"
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(BgPrimary)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp, vertical = 12.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text(
                text = "Settings",
                color = TextPrimary,
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Appearance Section
            SettingsSectionHeader(title = "APPEARANCE")
            SettingsCard {
                SettingsSwitchRow(
                    icon = Icons.Default.Palette,
                    title = "Dark Theme",
                    subtitle = "Cyberpunk dark cyan palette (Always active)",
                    checked = true,
                    enabled = false,
                    onCheckedChange = {}
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Notifications Section
            SettingsSectionHeader(title = "NOTIFICATIONS")
            SettingsCard {
                SettingsSwitchRow(
                    icon = Icons.Default.Notifications,
                    title = "Message Notifications",
                    subtitle = "Get alerted when new encrypted messages arrive",
                    checked = settings.notificationsEnabled,
                    onCheckedChange = onToggleNotifications
                )
                HorizontalDivider(color = BorderSubtle.copy(alpha = 0.3f), thickness = 0.5.dp, modifier = Modifier.padding(start = 56.dp))
                SettingsSwitchRow(
                    icon = Icons.Default.Notifications,
                    title = "Notification Previews",
                    subtitle = "Show sender name in system notification banners",
                    checked = settings.showNotificationPreview,
                    onCheckedChange = onTogglePreview
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Security Section
            SettingsSectionHeader(title = "SECURITY")
            SettingsCard {
                SettingsSwitchRow(
                    icon = Icons.Default.Lock,
                    title = "App Lock",
                    subtitle = "Require biometric or passcode on open",
                    checked = settings.appLockEnabled,
                    onCheckedChange = onToggleAppLock
                )
                HorizontalDivider(color = BorderSubtle.copy(alpha = 0.3f), thickness = 0.5.dp, modifier = Modifier.padding(start = 56.dp))
                SettingsNavRow(
                    icon = Icons.Default.Security,
                    title = "Auto-Delete Messages",
                    value = autoDeleteLabel,
                    onClick = { showAutoDeleteSheet = true }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // About Section
            SettingsSectionHeader(title = "ABOUT")
            SettingsCard {
                SettingsInfoRow(
                    title = "Version",
                    value = "1.0.0 (Native Android)"
                )
                HorizontalDivider(color = BorderSubtle.copy(alpha = 0.3f), thickness = 0.5.dp)
                SettingsNavRow(
                    icon = Icons.Default.Info,
                    title = "Privacy Manifesto",
                    value = "",
                    onClick = { showPrivacyDialog = true }
                )
                HorizontalDivider(color = BorderSubtle.copy(alpha = 0.3f), thickness = 0.5.dp)
                SettingsNavRow(
                    icon = Icons.Default.Info,
                    title = "Open Source Licenses",
                    value = "",
                    onClick = { showLicensesDialog = true }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
        }

        // Auto-Delete Sheet
        if (showAutoDeleteSheet) {
            ModalBottomSheet(
                onDismissRequest = { showAutoDeleteSheet = false },
                sheetState = rememberModalBottomSheetState(),
                containerColor = BgElevated
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 16.dp)
                ) {
                    Text(
                        text = "Auto-Delete Messages",
                        color = TextPrimary,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Automatically purge message history after a set period",
                        color = TextSecondary,
                        fontSize = 13.sp
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    val options = listOf(
                        null to "Never",
                        1 to "After 24 Hours",
                        7 to "After 7 Days",
                        30 to "After 30 Days"
                    )

                    options.forEach { (days, label) ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .clickable {
                                    onSetAutoDeleteDays(days)
                                    showAutoDeleteSheet = false
                                }
                                .padding(vertical = 10.dp, horizontal = 4.dp)
                        ) {
                            RadioButton(
                                selected = settings.autoDeleteDays == days,
                                onClick = {
                                    onSetAutoDeleteDays(days)
                                    showAutoDeleteSheet = false
                                },
                                colors = RadioButtonDefaults.colors(
                                    selectedColor = AccentPink,
                                    unselectedColor = TextMuted
                                )
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = label,
                                color = TextPrimary,
                                fontSize = 15.sp,
                                fontWeight = if (settings.autoDeleteDays == days) FontWeight.SemiBold else FontWeight.Normal
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
        }

        // Privacy Dialog
        if (showPrivacyDialog) {
            AlertDialog(
                onDismissRequest = { showPrivacyDialog = false },
                containerColor = BgElevated,
                title = {
                    Text("Privacy Manifesto", color = TextPrimary, fontWeight = FontWeight.Bold)
                },
                text = {
                    Text(
                        text = "Phantm is designed around zero knowledge architecture.\n\n" +
                                "• No phone numbers or emails required.\n" +
                                "• Cryptographic identity derived on-device with BIP39 & SHA-256.\n" +
                                "• Messages are end-to-end encrypted with no server-side message storage.\n" +
                                "• Zero analytics, zero ad trackers, zero telemetry.",
                        color = TextSecondary,
                        fontSize = 14.sp,
                        lineHeight = 20.sp
                    )
                },
                confirmButton = {
                    TextButton(onClick = { showPrivacyDialog = false }) {
                        Text("Close", color = AccentPink, fontWeight = FontWeight.Bold)
                    }
                }
            )
        }

        // Licenses Dialog
        if (showLicensesDialog) {
            AlertDialog(
                onDismissRequest = { showLicensesDialog = false },
                containerColor = BgElevated,
                title = {
                    Text("Open Source Licenses", color = TextPrimary, fontWeight = FontWeight.Bold)
                },
                text = {
                    Text(
                        text = "Phantm is open source software built on Android, Jetpack Compose, Kotlin Coroutines, and Room Database.\n\nLicensed under Apache License 2.0 and MIT License.",
                        color = TextSecondary,
                        fontSize = 14.sp,
                        lineHeight = 20.sp
                    )
                },
                confirmButton = {
                    TextButton(onClick = { showLicensesDialog = false }) {
                        Text("Close", color = AccentPink, fontWeight = FontWeight.Bold)
                    }
                }
            )
        }
    }
}

@Composable
fun SettingsSectionHeader(title: String) {
    Text(
        text = title,
        color = TextMuted,
        fontSize = 11.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 1.sp,
        modifier = Modifier.padding(start = 4.dp, bottom = 8.dp)
    )
}

@Composable
fun SettingsCard(content: @Composable () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(BgSurface)
            .padding(vertical = 4.dp)
    ) {
        Column {
            content()
        }
    }
}

@Composable
fun SettingsSwitchRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    checked: Boolean,
    enabled: Boolean = true,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = AccentPink,
            modifier = Modifier.size(22.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(text = title, color = TextPrimary, fontSize = 15.sp, fontWeight = FontWeight.Medium)
            Text(text = subtitle, color = TextSecondary, fontSize = 12.sp, lineHeight = 16.sp)
        }
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            enabled = enabled,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color(0xFF1A1218),
                checkedTrackColor = AccentPink,
                uncheckedThumbColor = TextSecondary,
                uncheckedTrackColor = BgElevated
            )
        )
    }
}

@Composable
fun SettingsNavRow(
    icon: ImageVector,
    title: String,
    value: String,
    onClick: () -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 14.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = AccentPink,
            modifier = Modifier.size(22.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Text(text = title, color = TextPrimary, fontSize = 15.sp, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f))
        if (value.isNotBlank()) {
            Text(text = value, color = TextSecondary, fontSize = 14.sp, modifier = Modifier.padding(end = 6.dp))
        }
        Icon(
            imageVector = Icons.Default.ChevronRight,
            contentDescription = "Navigate",
            tint = TextMuted,
            modifier = Modifier.size(18.dp)
        )
    }
}

@Composable
fun SettingsInfoRow(
    title: String,
    value: String
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 14.dp)
    ) {
        Text(text = title, color = TextPrimary, fontSize = 15.sp, fontWeight = FontWeight.Medium)
        Text(text = value, color = TextSecondary, fontSize = 14.sp)
    }
}
