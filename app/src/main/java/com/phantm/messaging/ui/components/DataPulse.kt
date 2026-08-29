package com.phantm.messaging.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.phantm.messaging.R
import com.phantm.messaging.ui.theme.AccentPink
import com.phantm.messaging.ui.theme.AccentPinkDim
import com.phantm.messaging.ui.theme.BgElevated
import com.phantm.messaging.ui.theme.BgSurface

@Composable
fun DataPulse(
    modifier: Modifier = Modifier,
    isActive: Boolean = true
) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse_transition")

    val pulseScale1 by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.45f,
        animationSpec = infiniteRepeatable(
            animation = tween(2400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "pulse1"
    )

    val pulseAlpha1 by infiniteTransition.animateFloat(
        initialValue = 0.5f,
        targetValue = 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(2400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "alpha1"
    )

    val pulseScale2 by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.75f,
        animationSpec = infiniteRepeatable(
            animation = tween(2400, delayMillis = 600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "pulse2"
    )

    val pulseAlpha2 by infiniteTransition.animateFloat(
        initialValue = 0.35f,
        targetValue = 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(2400, delayMillis = 600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "alpha2"
    )

    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier.size(140.dp)
    ) {
        if (isActive) {
            // Ring 2 (outer)
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .scale(pulseScale2)
                    .clip(CircleShape)
                    .border(1.5.dp, AccentPink.copy(alpha = pulseAlpha2), CircleShape)
            )

            // Ring 1 (inner)
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .scale(pulseScale1)
                    .clip(CircleShape)
                    .border(2.dp, AccentPink.copy(alpha = pulseAlpha1), CircleShape)
            )
        }

        // Core Glowing Circle
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(72.dp)
                .clip(CircleShape)
                .background(
                    Brush.radialGradient(
                        colors = listOf(AccentPinkDim.copy(alpha = 0.6f), BgElevated)
                    )
                )
                .border(2.dp, AccentPink, CircleShape)
        ) {
            Image(
                painter = painterResource(id = R.drawable.ic_phantm_icon),
                contentDescription = "Phantm Logo",
                modifier = Modifier.size(36.dp)
            )
        }
    }
}
