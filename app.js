const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { UserRoutes } = require("./routes");

const app = express();
const PORT = process.env.PORT || process.env.DEV_PORT;

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", UserRoutes);

module.exports = {app, PORT};
