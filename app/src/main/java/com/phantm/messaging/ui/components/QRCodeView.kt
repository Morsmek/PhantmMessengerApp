package com.phantm.messaging.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun QRCodeView(
    data: String,
    modifier: Modifier = Modifier,
    size: Dp = 200.dp
) {
    val gridSize = 25
    val matrix = remember(data) {
        val cells = Array(gridSize) { BooleanArray(gridSize) }
        var seed = 0
        for (ch in data) {
            seed = ((seed shl 5) - seed + ch.code) and 0x7fffffff
        }

        fun nextPseudo(): Float {
            seed = (seed * 1103515245 + 12345) and 0x7fffffff
            return seed.toFloat() / 0x7fffffff.toFloat()
        }

        // Draw Finder patterns in 3 corners
        fun drawFinder(row: Int, col: Int) {
            for (r in 0 until 7) {
                for (c in 0 until 7) {
                    val isBorder = r == 0 || r == 6 || c == 0 || c == 6
                    val isCenter = r in 2..4 && c in 2..4
                    cells[row + r][col + c] = isBorder || isCenter
                }
            }
        }
        drawFinder(0, 0)
        drawFinder(0, gridSize - 7)
        drawFinder(gridSize - 7, 0)

        // Timing patterns
        for (i in 8 until gridSize - 8) {
            cells[6][i] = (i % 2 == 0)
            cells[i][6] = (i % 2 == 0)
        }

        // Dark module
        cells[gridSize - 8][8] = true

        // Fill remaining payload cells
        for (r in 0 until gridSize) {
            for (c in 0 until gridSize) {
                val inFinder1 = r < 8 && c < 8
                val inFinder2 = r < 8 && c >= gridSize - 8
                val inFinder3 = r >= gridSize - 8 && c < 8
                if (!inFinder1 && !inFinder2 && !inFinder3 && r != 6 && c != 6) {
                    cells[r][c] = nextPseudo() > 0.5f
                }
            }
        }
        cells
    }

    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(Color.White)
            .padding(16.dp)
    ) {
        Canvas(modifier = Modifier.size(size)) {
            val cellSize = this.size.width / gridSize
            for (r in 0 until gridSize) {
                for (c in 0 until gridSize) {
                    if (matrix[r][c]) {
                        drawRect(
                            color = Color(0xFF1A1218),
                            topLeft = Offset(c * cellSize, r * cellSize),
                            size = Size(cellSize, cellSize)
                        )
                    }
                }
            }
        }
    }
}
