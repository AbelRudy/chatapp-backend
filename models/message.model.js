const mongoose = require("mongoose");
const _ = require("lodash");

const MessageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
		content: String,
	},
	{
		timestamps: true,
	}
);

MessageSchema.methods.toJSON = function () {
	return _.omit(this.toObject(), ["updatedAt", "__v"]);
};

module.exports = mongoose.model("messages", MessageSchema);
