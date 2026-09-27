package com.inventorysales.android.data

import com.inventorysales.android.domain.Customer
import com.inventorysales.android.domain.Product

object SampleData {
    val customers = listOf(
        Customer("harbor", "Harbor Market", "Harbor Market", 0.0),
        Customer("green-valley", "Green Valley Grocery", "Green Valley Grocery", 132.50),
        Customer("sunrise", "Sunrise Cafe", "Sunrise Cafe", 48.00)
    )

    val products = listOf(
        Product("coffee", "COF-100", "Premium Coffee", 12.00, 24),
        Product("water", "WTR-024", "Spring Water 24pk", 8.00, 0)
    )
}
