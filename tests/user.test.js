const request = require("supertest");
const { app } = require("../app");

let user = {
	username: "Rudy",
	email: "rudy@test.com",
	phoneNumber: "1234567890",
	password: "Test123@",
	repeatPassword: "Test123@",
};

describe("POST /api/v1/user/signup", () => {
	it("should return the created user", async () => {
		const res = await request(app).post("/api/v1/user/signup").send(user);

		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual(
			expect.objectContaining({
				status: "created",
				data: {
					_id: expect.any(String),
					username: user.username,
					email: user.email,
					phoneNumber: user.phoneNumber,
					bio: "Salut! Lançons un chat!",
					createdAt: expect.any(String),
				},
			})
		);

		//For other tests
		user = res.body.data;
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
			status: expect.any(String),
			message: expect.any(String),
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
			status: expect.any(String),
			message: expect.any(String),
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
			status: expect.any(String),
			message: expect.any(String),
		});
	});
});

describe("POST /api/v1/user/login", () => {
	describe("login by phone number", () => {
		it("should return the user with access and refresh tokens", async () => {
			const res = await request(app).post("/api/v1/user/login").send({
				phoneNumber: user.phoneNumber,
                password: user.password
			});

			expect(res.statusCode).toBe(200),
				expect(res.body).toEqual({
					status: "success",
					data: {
						_id: user._id,
		username: user.username,
		phoneNumber: user.phoneNumber,
		email: user.email,
		bio: user.bio,
		createdAt: user.createdAt,
						token: {
							accessToken: expect.any(String),
							refreshToken: expect.any(String),
						},
					},
				});
		});

		it("should return an error due to unknown phone number", async () => {
			const res = await request(app).post("/api/v1/user/login").send({
				phoneNumber: "1231231230",
                password: user.password
			});

			expect(res.statusCode).toBe(404);
			expect(res.body).toEqual({
				status: expect.any(String),
				message: expect.any(String),
			});
		});
	});
	
    describe("login by username or email and password", () => {
		it("(username) should return the user with access and refresh tokens", async () => {
			const res = await request(app).post("/api/v1/user/login").send({
				username: user.username,
                password: user.password,
			});

			expect(res.statusCode).toBe(200),
				expect(res.body).toEqual({
					status: "success",
					data: {
						_id: user._id,
		username: user.username,
		phoneNumber: user.phoneNumber,
		email: user.email,
		bio: user.bio,
		createdAt: user.createdAt,
						token: {
							accessToken: expect.any(String),
							refreshToken: expect.any(String),
						},
					},
				});
		});

        it("(email) should return the user with access and refresh tokens", async () => {
			const res = await request(app).post("/api/v1/user/login").send({
				email: user.email,
                password: user.password,
			});

			expect(res.statusCode).toBe(200),
				expect(res.body).toEqual({
					status: "success",
					data: {
						_id: user._id,
		username: user.username,
		phoneNumber: user.phoneNumber,
		email: user.email,
		bio: user.bio,
		createdAt: user.createdAt,
						token: {
							accessToken: expect.any(String),
							refreshToken: expect.any(String),
						},
					},
				});
		});

		it("should return an error due to unknown credentials", async () => {
			const res = await request(app).post("/api/v1/user/login").send({
				username: "Rudy123",//could be email*
                password: user.password
			});

			expect(res.statusCode).toBe(404);
			expect(res.body).toEqual({
				status: expect.any(String),
				message: expect.any(String),
			});
		});

        
	});
	
});
