const mongoose = require("mongoose");

module.exports = mongoose.set("strictQuery", false).connect(process.env.DB_URL);
