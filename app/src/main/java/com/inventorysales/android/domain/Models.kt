package com.inventorysales.android.domain

data class Customer(val id: String, val name: String, val businessName: String? = null, val balance: Double = 0.0)
data class Product(val id: String, val sku: String, val name: String, val unitPrice: Double, val quantityOnHand: Int, val tracksInventory: Boolean = true)
data class OrderLine(val product: Product, val quantity: Int, val unitPrice: Double) {
    val amount: Double get() = quantity * unitPrice
}
data class DraftOrder(val customer: Customer? = null, val lines: List<OrderLine> = emptyList(), val comments: String = "") {
    val total: Double get() = lines.sumOf { it.amount }
}
