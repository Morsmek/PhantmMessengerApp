package com.phantm.messaging.ui.screens.onboarding

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.scaleIn
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.phantm.messaging.ui.theme.AccentPink
import com.phantm.messaging.ui.theme.BgElevated
import com.phantm.messaging.ui.theme.BgPrimary
import com.phantm.messaging.ui.theme.BgSurface
import com.phantm.messaging.ui.theme.BorderSubtle
import com.phantm.messaging.ui.theme.ErrorRed
import com.phantm.messaging.ui.theme.SuccessGreen
import com.phantm.messaging.ui.theme.TextMuted
import com.phantm.messaging.ui.theme.TextPrimary
import com.phantm.messaging.ui.theme.TextSecondary
import com.phantm.messaging.ui.viewmodel.QuizRound

@Composable
fun PassphraseConfirmScreen(
    currentRound: QuizRound?,
    roundIndex: Int,
    selectedOption: String?,
    feedback: Boolean?,
    isComplete: Boolean,
    onOptionSelected: (String) -> Unit,
    onFinished: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(BgPrimary)
            .windowInsetsPadding(WindowInsets.statusBars)
            .windowInsetsPadding(WindowInsets.navigationBars)
    ) {
        if (isComplete) {
            // Completion View
            AnimatedVisibility(
                visible = true,
                enter = fadeIn() + scaleIn(),
                modifier = Modifier.fillMaxSize()
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .size(90.dp)
                            .clip(CircleShape)
                            .background(SuccessGreen.copy(alpha = 0.15f))
                            .border(2.dp, SuccessGreen, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Check,
                            contentDescription = "Success",
                            tint = SuccessGreen,
                            modifier = Modifier.size(48.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(28.dp))

                    Text(
                        text = "All Correct!",
                        color = TextPrimary,
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Your identity is secured. Welcome to Phantm.",
                        color = TextSecondary,
                        fontSize = 15.sp,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(36.dp))

                    Button(
                        onClick = onFinished,
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = AccentPink,
                            contentColor = Color(0xFF1A1218)
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp)
                    ) {
                        Text(
                            text = "Enter Phantm",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        } else if (currentRound != null) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 24.dp, vertical = 24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    // Progress Indicator
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "VERIFICATION",
                            color = AccentPink,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp
                        )
                        Text(
                            text = "Step ${roundIndex + 1} of 3",
                            color = TextSecondary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    LinearProgressIndicator(
                        progress = { (roundIndex + 1) / 3f },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(RoundedCornerShape(3.dp)),
                        color = AccentPink,
                        trackColor = BgElevated
                    )

                    Spacer(modifier = Modifier.height(36.dp))

                    Text(
                        text = "Confirm Word #${currentRound.wordIndex}",
                        color = TextPrimary,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Select the word that was in position #${currentRound.wordIndex} of your 20-word phrase.",
                        color = TextSecondary,
                        fontSize = 14.sp,
                        textAlign = TextAlign.Center,
                        lineHeight = 20.sp
                    )

                    Spacer(modifier = Modifier.height(36.dp))

                    // 4 Options (2x2 Grid)
                    Column(
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        for (rowIndex in 0 until 2) {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                for (colIndex in 0 until 2) {
                                    val optIndex = rowIndex * 2 + colIndex
                                    if (optIndex < currentRound.options.size) {
                                        val option = currentRound.options[optIndex]
                                        val isChosen = selectedOption == option

                                        val borderCol = when {
                                            isChosen && feedback == true -> SuccessGreen
                                            isChosen && feedback == false -> ErrorRed
                                            else -> BorderSubtle
                                        }

                                        val bgCol = when {
                                            isChosen && feedback == true -> SuccessGreen.copy(alpha = 0.15f)
                                            isChosen && feedback == false -> ErrorRed.copy(alpha = 0.15f)
                                            else -> BgSurface
                                        }

                                        Box(
                                            contentAlignment = Alignment.Center,
                                            modifier = Modifier
                                                .weight(1f)
                                                .height(76.dp)
                                                .clip(RoundedCornerShape(14.dp))
                                                .background(bgCol)
                                                .border(2.dp, borderCol, RoundedCornerShape(14.dp))
                                                .clickable(enabled = feedback == null) {
                                                    onOptionSelected(option)
                                                }
                                                .padding(8.dp)
                                        ) {
                                            Text(
                                                text = option,
                                                color = when {
                                                    isChosen && feedback == true -> SuccessGreen
                                                    isChosen && feedback == false -> ErrorRed
                                                    else -> TextPrimary
                                                },
                                                fontFamily = FontFamily.Monospace,
                                                fontSize = 16.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Bottom hint or status
                Text(
                    text = if (feedback == false) "Incorrect word. Try again." else "Security check ensures your phrase was recorded.",
                    color = if (feedback == false) ErrorRed else TextMuted,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}
