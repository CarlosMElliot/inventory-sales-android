package com.inventorysales.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.inventorysales.android.ui.InventorySalesApp
import com.inventorysales.android.ui.theme.InventorySalesTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { InventorySalesTheme { InventorySalesApp() } }
    }
}
