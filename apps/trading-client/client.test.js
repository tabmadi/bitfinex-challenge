const { afterEach, describe, expect, test } = require("bun:test");
const ExchangeClient = require("./client.js");

describe("ExchangeClient", () => {
	let client;

	afterEach(() => {
		if (client) {
			client.disconnect();
			client = null;
		}
	});

	describe("order book", () => {
		test("submitOrder", async () => {
			client = new ExchangeClient();
			const result = await client.submitOrder("buy", 100, 50);
			expect(result).toBeDefined();
		});

		test("getOrderBook", async () => {
			client = new ExchangeClient();
			const result = await client.getOrderBook();
			expect(result).toBeDefined();
		});

		test("registerPeer", async () => {
			client = new ExchangeClient();
			const result = await client.registerPeer();
			expect(result).toBeDefined();
		});
	});

	describe("disconnect", () => {
		test("should disconnect without errors", () => {
			client = new ExchangeClient();
			expect(() => client.disconnect()).not.toThrow();
			client = null; // Prevent double disconnect in afterEach
		});
	});
});
