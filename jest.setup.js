const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

/* Remove all collections in database */
beforeAll(async () => {
	await mongoose.connect(process.env.DB_URL_TEST);
	await mongoose.connection.db.dropDatabase();
	await mongoose.connection.close();
});

/* Connecting to the database before each test. */
beforeEach(async () => {
	await mongoose.connect(process.env.DB_URL_TEST);
});

/* Closing database connection after each test. */
afterEach(async () => {
	await mongoose.connection.close();
});

global.console = {
	...console,
	log: jest.fn(),
};
