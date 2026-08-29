package com.phantm.messaging.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.phantm.messaging.ui.theme.AccentPink
import com.phantm.messaging.ui.theme.AccentPinkDim
import com.phantm.messaging.ui.theme.BgElevated

@Composable
fun ShimmerBadge(
    modifier: Modifier = Modifier,
    text: String = "Encrypted"
) {
    val transition = rememberInfiniteTransition(label = "shimmer_badge")
    val translateAnim by transition.animateFloat(
        initialValue = 0f,
        targetValue = 600f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "shimmer_translate"
    )

    val shimmerBrush = Brush.linearGradient(
        colors = listOf(
            BgElevated,
            AccentPinkDim.copy(alpha = 0.35f),
            AccentPink.copy(alpha = 0.7f),
            AccentPinkDim.copy(alpha = 0.35f),
            BgElevated
        ),
        start = Offset(translateAnim - 300f, 0f),
        end = Offset(translateAnim, 100f)
    )

    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(shimmerBrush)
            .border(1.dp, AccentPink.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Icon(
            imageVector = Icons.Default.Lock,
            contentDescription = "Encrypted",
            tint = AccentPink,
            modifier = Modifier.size(11.dp)
        )
        Text(
            text = text,
            color = AccentPink,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}
