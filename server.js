const mongoose = require("mongoose");
const http = require("http");
const { app, PORT } = require("./app");

mongoose.set("strictQuery", false);
const server = http.createServer(app);

mongoose
	.connect(process.env.DB_URL)
	.then(() => {
		server.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log("Error while connecting to database");
		console.log(err);
	});
