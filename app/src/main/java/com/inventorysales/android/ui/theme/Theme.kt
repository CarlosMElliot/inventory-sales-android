package com.inventorysales.android.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val AppColors = lightColorScheme(
    primary = Color(0xFF006D65),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFE4F2EE),
    onPrimaryContainer = Color(0xFF172D32),
    background = Color(0xFFF5F8F7),
    onBackground = Color(0xFF172D32),
    surface = Color.White,
    onSurface = Color(0xFF172D32),
    outline = Color(0xFFDCE6E2),
    secondary = Color(0xFF60757A),
    errorContainer = Color(0xFFFFF2D8),
    onErrorContainer = Color(0xFF875600)
)

@Composable
fun InventorySalesTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = AppColors, content = content)
}
