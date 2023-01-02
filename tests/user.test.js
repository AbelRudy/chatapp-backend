const mongoose = require("mongoose");
const request = require("supertest");
const { app } = require("../app");
require("dotenv").config({ path: "./config/.env" });

/* Connecting to the database before each test. */
beforeEach(async () => {
	await mongoose.connect(process.env.DB_URL_TEST);
});

/* Closing database connection after each test. */
afterEach(async () => {
	await mongoose.connection.close();
});

describe("POST /api/v1/user/signup", () => {
	it("should return the created user", async () => {
		const res = await request(app).post("/api/v1/user/signup").send({
			username: "Rudy",
			email: "rudy@test.com",
			phoneNumber: "1234567890",
			password: "Test123@",
			repeatPassword: "Test123@",
		});

		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual(
			expect.objectContaining({
				status: "created",
				data: expect.objectContaining({
					username: "Rudy",
					email: "rudy@test.com",
					phoneNumber: "1234567890",
					bio: "Salut! Lançons un chat!",
				}),
			})
		);
	});
});
