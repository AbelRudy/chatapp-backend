const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" });
const dbConnection = require("./config/db");

const app = express();
const PORT = process.env.PORT || process.env.DEV_PORT;

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

dbConnection
	.then(() => {
		server.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log("Error while connecting to database");
		console.log(err);
	});
