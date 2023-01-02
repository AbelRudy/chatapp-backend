const request = require("supertest");
const { app } = require("../app");

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

	it("should return an error for duplicate username", async () => {
		const res = await request(app).post("/api/v1/user/signup").send({
			username: "Rudy",
			email: "rudy123@test.com",
			phoneNumber: "1114567890",
			password: "Test123@",
			repeatPassword: "Test123@",
		});

		expect(res.statusCode).toBe(409);
		expect(res.body).toEqual({
			status: "error : conflict",
			message: "Un compte existe déjà avec ce username.",
		});
	});
});
