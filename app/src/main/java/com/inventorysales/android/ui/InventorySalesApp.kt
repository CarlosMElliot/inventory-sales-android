package com.inventorysales.android.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.inventorysales.android.data.SampleData
import com.inventorysales.android.domain.*
import java.util.Locale

private enum class Screen { HOME, CUSTOMER, BUILD, REVIEW, SAVED }

@Composable
fun InventorySalesApp() {
    var screen by remember { mutableStateOf(Screen.HOME) }
    var draft by remember { mutableStateOf(DraftOrder()) }
    var nextOrderNumber by remember { mutableIntStateOf(1001) }

    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(selected = screen == Screen.HOME, onClick = { screen = Screen.HOME }, icon = { Icon(Icons.Outlined.Home, null) }, label = { Text("Home") })
                NavigationBarItem(selected = screen == Screen.CUSTOMER, onClick = { screen = Screen.CUSTOMER }, icon = { Icon(Icons.Outlined.People, null) }, label = { Text("Customers") })
                NavigationBarItem(selected = false, onClick = {}, icon = { Icon(Icons.Outlined.Inventory2, null) }, label = { Text("Products") })
                NavigationBarItem(selected = false, onClick = {}, icon = { Icon(Icons.Outlined.MoreHoriz, null) }, label = { Text("More") })
            }
        }
    ) { padding ->
        Box(Modifier.padding(padding).fillMaxSize()) {
            when (screen) {
                Screen.HOME -> HomeScreen {
                    draft = DraftOrder()
                    screen = Screen.CUSTOMER
                }
                Screen.CUSTOMER -> ChooseCustomerScreen(
                    onBack = { screen = Screen.HOME },
                    onSelect = {
                        draft = draft.copy(customer = it)
                        screen = Screen.BUILD
                    }
                )
                Screen.BUILD -> BuildOrderScreen(draft, { screen = Screen.CUSTOMER }, { draft = it }, { screen = Screen.REVIEW })
                Screen.REVIEW -> ReviewOrderScreen(draft, { screen = Screen.BUILD }, { screen = Screen.SAVED })
                Screen.SAVED -> SavedOrderScreen("ORD-" + nextOrderNumber, draft) {
                    nextOrderNumber++
                    draft = DraftOrder()
                    screen = Screen.HOME
                }
            }
        }
    }
}

@Composable
private fun HomeScreen(onOrder: () -> Unit) {
    LazyColumn(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        item {
            Text("Northside Supply", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Text("Good morning, Alex", color = MaterialTheme.colorScheme.secondary)
        }
        item { Text("New transaction", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold) }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                ActionCard("Order", Icons.Outlined.ShoppingCart, Modifier.weight(1f), onOrder)
                ActionCard("Invoice", Icons.Outlined.ReceiptLong, Modifier.weight(1f)) {}
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                ActionCard("Credit", Icons.Outlined.AssignmentReturn, Modifier.weight(1f)) {}
                ActionCard("Payment", Icons.Outlined.Payments, Modifier.weight(1f)) {}
            }
        }
        item {
            ElevatedCard(shape = RoundedCornerShape(16.dp)) {
                Column(Modifier.padding(18.dp)) {
                    Text("Today", fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(8.dp))
                    Text("Orders  3")
                    Text("Sales invoiced  $248.00")
                    Text("Payments  $196.00")
                }
            }
        }
        item { Text("Milestone 1 uses local sample data only.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.secondary) }
    }
}

@Composable
private fun ActionCard(label: String, icon: androidx.compose.ui.graphics.vector.ImageVector, modifier: Modifier, onClick: () -> Unit) {
    ElevatedCard(onClick = onClick, modifier = modifier, shape = RoundedCornerShape(16.dp)) {
        Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Icon(icon, null, tint = MaterialTheme.colorScheme.primary)
            Text(label, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun ChooseCustomerScreen(onBack: () -> Unit, onSelect: (Customer) -> Unit) {
    var query by remember { mutableStateOf("") }
    val filtered = SampleData.customers.filter { it.name.contains(query, true) || (it.businessName?.contains(query, true) == true) }
    Column(Modifier.fillMaxSize().padding(20.dp)) {
        TopRow("Choose customer", onBack)
        OutlinedTextField(value = query, onValueChange = { query = it }, modifier = Modifier.fillMaxWidth(), label = { Text("Search customers") }, leadingIcon = { Icon(Icons.Outlined.Search, null) })
        Spacer(Modifier.height(12.dp))
        TextButton(onClick = {}) { Icon(Icons.Outlined.PersonAdd, null); Spacer(Modifier.width(8.dp)); Text("Create customer") }
        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(filtered) { customer ->
                ElevatedCard(onClick = { onSelect(customer) }, shape = RoundedCornerShape(16.dp)) {
                    Column(Modifier.fillMaxWidth().padding(16.dp)) {
                        Text(customer.name, fontWeight = FontWeight.Bold)
                        Text("Balance " + money(customer.balance), color = MaterialTheme.colorScheme.secondary)
                    }
                }
            }
        }
    }
}

@Composable
private fun BuildOrderScreen(draft: DraftOrder, onBack: () -> Unit, onChange: (DraftOrder) -> Unit, onReview: () -> Unit) {
    val lineMap = draft.lines.associateBy { it.product.id }
    Column(Modifier.fillMaxSize().padding(20.dp)) {
        TopRow("Build order", onBack)
        Text(draft.customer?.name.orEmpty(), color = MaterialTheme.colorScheme.secondary)
        Spacer(Modifier.height(12.dp))
        LazyColumn(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(SampleData.products) { product ->
                ProductOrderCard(product, lineMap[product.id]) { quantity, price ->
                    val lines = draft.lines.filterNot { it.product.id == product.id }.toMutableList()
                    if (quantity > 0) lines += OrderLine(product, quantity, price)
                    onChange(draft.copy(lines = lines))
                }
            }
        }
        Button(onClick = onReview, enabled = draft.lines.isNotEmpty(), modifier = Modifier.fillMaxWidth()) {
            Text("Review order · " + money(draft.total))
        }
    }
}

@Composable
private fun ProductOrderCard(product: Product, line: OrderLine?, onUpdate: (Int, Double) -> Unit) {
    var priceText by remember(product.id, line?.unitPrice) { mutableStateOf((line?.unitPrice ?: product.unitPrice).toString()) }
    val quantity = line?.quantity ?: 0
    ElevatedCard(shape = RoundedCornerShape(16.dp)) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    Text(product.name, fontWeight = FontWeight.Bold)
                    Text(product.sku + " · " + product.quantityOnHand + " in stock", color = MaterialTheme.colorScheme.secondary)
                }
                Text(money(line?.unitPrice ?: product.unitPrice), fontWeight = FontWeight.Bold)
            }
            if (product.tracksInventory && quantity > product.quantityOnHand) {
                Surface(color = MaterialTheme.colorScheme.errorContainer, shape = RoundedCornerShape(10.dp)) {
                    Text("Stock warning: order may exceed available inventory. Orders do not deduct stock.", modifier = Modifier.padding(10.dp), color = MaterialTheme.colorScheme.onErrorContainer)
                }
            }
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedButton(onClick = { onUpdate((quantity - 1).coerceAtLeast(0), priceText.toDoubleOrNull() ?: product.unitPrice) }) { Text("−") }
                Text(quantity.toString(), Modifier.width(28.dp))
                OutlinedButton(onClick = { onUpdate(quantity + 1, priceText.toDoubleOrNull() ?: product.unitPrice) }) { Text("+") }
                OutlinedTextField(value = priceText, onValueChange = { value -> priceText = value; value.toDoubleOrNull()?.let { onUpdate(quantity, it) } }, modifier = Modifier.weight(1f), label = { Text("Unit price") }, singleLine = true)
            }
        }
    }
}

@Composable
private fun ReviewOrderScreen(draft: DraftOrder, onBack: () -> Unit, onSave: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(20.dp)) {
        TopRow("Review order", onBack)
        LazyColumn(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            item {
                ElevatedCard(shape = RoundedCornerShape(16.dp)) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Customer", color = MaterialTheme.colorScheme.secondary)
                        Text(draft.customer?.name.orEmpty(), fontWeight = FontWeight.Bold)
                        Text("Terms: Not recorded")
                    }
                }
            }
            items(draft.lines) { line ->
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column {
                        Text(line.product.name, fontWeight = FontWeight.Bold)
                        Text(line.quantity.toString() + " × " + money(line.unitPrice), color = MaterialTheme.colorScheme.secondary)
                    }
                    Text(money(line.amount), fontWeight = FontWeight.Bold)
                }
            }
            item {
                HorizontalDivider()
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Total", fontWeight = FontWeight.Bold)
                    Text(money(draft.total), fontWeight = FontWeight.Bold)
                }
            }
        }
        Button(onClick = onSave, modifier = Modifier.fillMaxWidth()) { Text("Save order") }
    }
}

@Composable
private fun SavedOrderScreen(orderNumber: String, draft: DraftOrder, onDone: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        Text("Order saved", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text(orderNumber, color = MaterialTheme.colorScheme.secondary)
        ElevatedCard(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth().weight(1f)) {
            Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("CUSTOMER ORDER", fontWeight = FontWeight.Bold)
                Text("Sold To: " + draft.customer?.name.orEmpty())
                Text("Ship To: " + draft.customer?.name.orEmpty())
                HorizontalDivider()
                draft.lines.forEach { line ->
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(line.quantity.toString() + "  " + line.product.sku + "  " + line.product.name)
                        Text(money(line.amount))
                    }
                }
                HorizontalDivider()
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Total", fontWeight = FontWeight.Bold)
                    Text(money(draft.total), fontWeight = FontWeight.Bold)
                }
                Text("Payment: Not recorded", style = MaterialTheme.typography.bodySmall)
                Text("Milestone 1 preview only. PDF/print/share will follow docs/PRINT_PREVIEW_SPEC.md.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.secondary)
            }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedButton(onClick = {}, modifier = Modifier.weight(1f)) { Icon(Icons.Outlined.Print, null); Spacer(Modifier.width(6.dp)); Text("Print") }
            OutlinedButton(onClick = {}, modifier = Modifier.weight(1f)) { Icon(Icons.Outlined.Email, null); Spacer(Modifier.width(6.dp)); Text("Email") }
            OutlinedButton(onClick = {}, modifier = Modifier.weight(1f)) { Icon(Icons.Outlined.Share, null); Spacer(Modifier.width(6.dp)); Text("Share") }
        }
        Button(onClick = onDone, modifier = Modifier.fillMaxWidth()) { Text("Done") }
    }
}

@Composable
private fun TopRow(title: String, onBack: () -> Unit) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        IconButton(onClick = onBack) { Icon(Icons.Outlined.ArrowBack, "Back") }
        Text(title, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
    }
}

private fun money(value: Double): String = String.format(Locale.US, "$%.2f", value)
