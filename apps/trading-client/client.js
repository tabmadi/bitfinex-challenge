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

module.exports = ExchangeClient;
