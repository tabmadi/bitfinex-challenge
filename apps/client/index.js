const { PeerRPCClient } = require("grenache-nodejs-ws");
const Link = require("grenache-nodejs-link");

class ExchangeClient {
	constructor() {
		this.link = new Link({
			grape: "http://127.0.0.1:30001",
			requestTimeout: 10000,
		});
		this.link.start();

		this.peer = new PeerRPCClient(this.link, {});
		this.peer.init();

		this.clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	async submitOrder(side, price, quantity) {
		return new Promise((resolve, reject) => {
			const order = {
				side,
				price,
				quantity,
				clientId: this.clientId,
			};

			this.peer.request("exchange_node", { action: "submitOrder", data: order }, { timeout: 10000 }, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}

	async getOrderBook() {
		return new Promise((resolve, reject) => {
			this.peer.request("exchange_node", { action: "getOrderBook", data: {} }, { timeout: 10000 }, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}

	async registerPeer() {
		return new Promise((resolve, reject) => {
			this.peer.request(
				"exchange_node",
				{ action: "registerPeer", data: { peerId: this.clientId } },
				{ timeout: 10000 },
				(err, result) => {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				},
			);
		});
	}

	disconnect() {
		this.link.stop();
	}
}

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
