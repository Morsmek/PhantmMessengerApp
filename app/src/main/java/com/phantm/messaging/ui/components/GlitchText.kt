package com.phantm.messaging.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.offset
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.sp
import com.phantm.messaging.ui.theme.AccentPink
import com.phantm.messaging.ui.theme.TextPrimary
import kotlinx.coroutines.delay
import kotlin.math.roundToInt

@Composable
fun GlitchText(
    text: String,
    modifier: Modifier = Modifier,
    fontSize: TextUnit = 13.sp,
    color: Color = TextPrimary
) {
    val offsetX = remember { Animatable(0f) }
    val glitchAlpha = remember { Animatable(0.7f) }

    LaunchedEffect(text) {
        for (i in 0..4) {
            offsetX.animateTo(
                targetValue = (if (i % 2 == 0) 3f else -3f),
                animationSpec = tween(70, easing = FastOutSlowInEasing)
            )
            delay(40)
        }
        offsetX.animateTo(0f, tween(100))
        glitchAlpha.animateTo(0f, tween(200))
    }

    Box(modifier = modifier) {
        // Red / Pink chromatic channel
        if (glitchAlpha.value > 0.05f) {
            Text(
                text = text,
                color = AccentPink.copy(alpha = glitchAlpha.value),
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Medium,
                fontSize = fontSize,
                modifier = Modifier.offset {
                    IntOffset(
                        x = offsetX.value.roundToInt(),
                        y = 0
                    )
                }
            )
            // Cyan chromatic channel
            Text(
                text = text,
                color = Color.Cyan.copy(alpha = glitchAlpha.value * 0.7f),
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Medium,
                fontSize = fontSize,
                modifier = Modifier.offset {
                    IntOffset(
                        x = (-offsetX.value).roundToInt(),
                        y = 0
                    )
                }
            )
        }

        // Main Base Text
        Text(
            text = text,
            color = color,
            fontFamily = FontFamily.Monospace,
            fontWeight = FontWeight.Medium,
            fontSize = fontSize
        )
    }
}
