package com.inventorysales.android.domain

import org.junit.Assert.assertEquals
import org.junit.Test

class DraftOrderTest {
    @Test
    fun total_uses_transaction_price_overrides() {
        val product = Product("p1", "SKU", "Coffee", 12.0, 10)
        val draft = DraftOrder(customer = Customer("c1", "Harbor Market"), lines = listOf(OrderLine(product, 2, 10.0)))
        assertEquals(20.0, draft.total, 0.0)
    }

    @Test
    fun order_line_can_exceed_stock_without_changing_product_stock() {
        val product = Product("p1", "SKU", "Water", 8.0, 3)
        val line = OrderLine(product, 5, 8.0)
        assertEquals(40.0, line.amount, 0.0)
        assertEquals(3, product.quantityOnHand)
    }
}
