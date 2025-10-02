const ExchangeClient = require("./client.js");

async function runDemo() {
	console.log("Starting Exchange Client Demo...");

	const client = new ExchangeClient();

	try {
		// Register with the exchange
		await client.registerPeer();
		console.log("✓ Registered with exchange");

		// Get initial orderbook
		let orderbook = await client.getOrderBook();
		console.log("✓ Initial orderbook:", JSON.stringify(orderbook.orderBook, null, 2));

		// Submit a buy order
		console.log("\n📈 Submitting buy order: 100 units at $50 each");
		const buyResult = await client.submitOrder("buy", 50, 100);
		console.log("✓ Buy order result:", JSON.stringify(buyResult, null, 2));

		// Submit a sell order that should match
		console.log("\n📉 Submitting sell order: 50 units at $45 each");
		const sellResult = await client.submitOrder("sell", 45, 50);
		console.log("✓ Sell order result:", JSON.stringify(sellResult, null, 2));

		// Get updated orderbook
		orderbook = await client.getOrderBook();
		console.log("\n📊 Updated orderbook:", JSON.stringify(orderbook.orderBook, null, 2));

		// Submit another sell order that won't match
		console.log("\n📉 Submitting sell order: 25 units at $55 each");
		const sellResult2 = await client.submitOrder("sell", 55, 25);
		console.log("✓ Sell order result:", JSON.stringify(sellResult2, null, 2));

		// Final orderbook state
		orderbook = await client.getOrderBook();
		console.log("\n📊 Final orderbook:", JSON.stringify(orderbook.orderBook, null, 2));
	} catch (error) {
		console.error("❌ Error:", error.message);
	} finally {
		client.disconnect();
		console.log("\n✓ Client disconnected");
		process.exit(0);
	}
}

runDemo();
