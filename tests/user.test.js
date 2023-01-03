const request = require("supertest");
const { app } = require("../app");

const user = {
    username: "Rudy",
    email: "rudy@test.com",
    phoneNumber: "1234567890",
    password: "Test123@",
    repeatPassword: "Test123@",
}

describe("POST /api/v1/user/signup", () => {
	it("should return the created user", async () => {
		const res = await request(app).post("/api/v1/user/signup").send(user);

		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual(
			expect.objectContaining({
				status: "created",
				data: expect.objectContaining({
					username: user.username,
					email: user.email,
					phoneNumber: user.phoneNumber,
					bio: "Salut! Lançons un chat!",
				}),
			})
		);
	});

	it("should return an error for duplicate username", async () => {
		const res = await request(app).post("/api/v1/user/signup").send({
			username: user.username,
			email: "rudy123@test.com",
			phoneNumber: "1114567890",
			password: "Test123@",
			repeatPassword: "Test123@",
		});

		expect(res.statusCode).toBe(409);
		expect(res.body).toEqual({
			status: expect.stringContaining("error"),
			message: expect.stringContaining("username"),
		});
	});

	it("should return an error for duplicate email", async () => {
		const res = await request(app).post("/api/v1/user/signup").send({
			username: "Rudy123",
			email: user.email,
			phoneNumber: "1114567890",
			password: "Test123@",
			repeatPassword: "Test123@",
		});

		expect(res.statusCode).toBe(409);
		expect(res.body).toEqual({
			status: expect.stringContaining("error"),
			message: expect.stringContaining("email"),
		});
	});

	it("should return an error for duplicate phone number", async () => {
		const res = await request(app).post("/api/v1/user/signup").send({
			username: "Rudy123",
			email: "rudy123@test.com",
			phoneNumber: user.phoneNumber,
			password: "Test123@",
			repeatPassword: "Test123@",
		});

		expect(res.statusCode).toBe(409);
		expect(res.body).toEqual({
			status: expect.stringContaining("error"),
			message: expect.stringMatching(/phone|téléphone/),
		});
	});
});
