const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
		},
		phoneNumber: {
			type: String,
			unique: true,
		},
		email: {
			type: String,
			unique: true,
		},
		password: String,
		image: {
			type: String,
			default: "avatar.png",
		},
		bio: {
			type: String,
			default: "Salut! Lançons un chat!",
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.methods.getUserInfos = function () {
	return {
		_id: this._id,
		username: this.username,
		phoneNumber: this.phoneNumber,
		email: this.email,
		bio: this.bio,
		createdAt: this.createdAt,
	};
};

module.exports = mongoose.model("users", UserSchema);
