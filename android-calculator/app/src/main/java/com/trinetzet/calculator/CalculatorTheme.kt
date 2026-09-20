package com.trinetzet.calculator

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val CalculatorColors = darkColorScheme(
    primary = Color(0xFFFF9F0A),
    onPrimary = Color.Black,
    background = Color(0xFF101114),
    onBackground = Color(0xFFF4F4F5),
    surface = Color(0xFF101114),
    onSurface = Color(0xFFF4F4F5),
    secondaryContainer = Color(0xFF303136),
    onSecondaryContainer = Color.White,
    errorContainer = Color(0xFF9B2C2C),
    onErrorContainer = Color.White,
)

@Composable
fun CalculatorTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = CalculatorColors,
        content = content,
    )
}
