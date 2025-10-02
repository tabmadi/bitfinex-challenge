const { PeerRPCServer, PeerRPCClient } = require("grenache-nodejs-ws");
const Link = require("grenache-nodejs-link");

class OrderBook {
	constructor() {
		this.buyOrders = []; // [{id, price, quantity, clientId}]
		this.sellOrders = []; // [{id, price, quantity, clientId}]
		this.trades = []; // [{buyOrderId, sellOrderId, price, quantity, timestamp}]
	}

	addOrder(order) {
		const orderWithId = {
			...order,
			id: Date.now() + Math.random().toString(36).substr(2, 9),
			timestamp: Date.now(),
		};

		if (order.side === "buy") {
			this.buyOrders.push(orderWithId);
			this.buyOrders.sort((a, b) => b.price - a.price); // Sort by price desc
		} else {
			this.sellOrders.push(orderWithId);
			this.sellOrders.sort((a, b) => a.price - b.price); // Sort by price asc
		}

		return this.matchOrders();
	}

	matchOrders() {
		const matches = [];

		while (this.buyOrders.length > 0 && this.sellOrders.length > 0) {
			const bestBuy = this.buyOrders[0];
			const bestSell = this.sellOrders[0];

			if (bestBuy.price >= bestSell.price) {
				const tradeQuantity = Math.min(bestBuy.quantity, bestSell.quantity);
				const tradePrice = bestSell.price; // Price discovery: seller's price

				const trade = {
					buyOrderId: bestBuy.id,
					sellOrderId: bestSell.id,
					price: tradePrice,
					quantity: tradeQuantity,
					timestamp: Date.now(),
				};

				matches.push(trade);
				this.trades.push(trade);

				// Update order quantities
				bestBuy.quantity -= tradeQuantity;
				bestSell.quantity -= tradeQuantity;

				// Remove filled orders
				if (bestBuy.quantity === 0) {
					this.buyOrders.shift();
				}
				if (bestSell.quantity === 0) {
					this.sellOrders.shift();
				}
			} else {
				break; // No more matches possible
			}
		}

		return matches;
	}

	getOrderBook() {
		return {
			buyOrders: this.buyOrders.slice(0, 10), // Top 10 buy orders
			sellOrders: this.sellOrders.slice(0, 10), // Top 10 sell orders
			trades: this.trades.slice(-10), // Last 10 trades
		};
	}
}

const orderBook = new OrderBook();
const peers = new Set(); // Track connected peers

const link = new Link({
	grape: "http://127.0.0.1:30001",
});
link.start();

const peer = new PeerRPCServer(link, {});
peer.init();

const client = new PeerRPCClient(link, {});
client.init();

const service = peer.transport("server");

const port = Number.parseInt(process.env.PORT) || 1337;
service.listen(port);

setInterval(() => {
	link.announce("exchange_node", service.port, {});
}, 1000);

service.on("request", (_rid, _key, payload, handler) => {
	try {
		const { action, data } = payload;

		switch (action) {
			case "submitOrder": {
				const matches = orderBook.addOrder(data);
				// Broadcast order to other nodes
				broadcastToOtherNodes("orderUpdate", {
					order: data,
					matches: matches,
					orderBook: orderBook.getOrderBook(),
				});
				handler.reply(null, {
					success: true,
					matches: matches,
					orderBook: orderBook.getOrderBook(),
				});
				break;
			}

			case "getOrderBook":
				handler.reply(null, {
					success: true,
					orderBook: orderBook.getOrderBook(),
				});
				break;

			case "orderUpdate": {
				// Receive order updates from other nodes
				if (data.order) {
					orderBook.addOrder(data.order);
				}
				handler.reply(null, { success: true });
				break;
			}

			case "registerPeer": {
				peers.add(data.peerId);
				handler.reply(null, {
					success: true,
					message: "Peer registered successfully",
				});
				break;
			}

			default:
				handler.reply(new Error("Unknown action"), null);
		}
	} catch (error) {
		handler.reply(error, null);
	}
});

function broadcastToOtherNodes(action, data) {
	if (peers.size === 0) {
		console.log(`No peers to broadcast ${action} to`);
		return;
	}

	console.log(`Broadcasting ${action} to ${peers.size} peers`);

	// Use Grenache's service discovery to find other exchange_node instances
	// Since we can't target specific peers directly, we broadcast to the service
	// and let the network handle distribution
	const payload = { action, data };

	// Make multiple requests to increase the chance of reaching different nodes
	// This is a simple approach for distributed broadcasting
	for (let i = 0; i < Math.min(peers.size, 3); i++) {
		client.request("exchange_node", payload, { timeout: 5000 }, (err, _result) => {
			if (err) {
				console.error(`Broadcast error for ${action}:`, err.message);
			} else {
				console.log(`Successfully broadcasted ${action} to a peer`);
			}
		});
	}
}

console.log(`Exchange node started on port ${port}`);
console.log("Available actions: submitOrder, getOrderBook, orderUpdate, registerPeer");
