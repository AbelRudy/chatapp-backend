const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { randomBytes } = require("crypto");
require("dotenv").config({});

const { JWT_SECRET_KEY } = process.env;

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
		sessions: [{
			refreshToken: {
				type: String,
				required: true
			},
			expiresAt: {
				type: Number,
				required: true
			}
		}]
	},
	{
		timestamps: true,
	}
);

UserSchema.methods.toJSON = function () {
	return _.omit(this.toObject(), ['password', 'sessions', "__v", "updatedAt"]);
};

UserSchema.methods.generateTokens = function () {
	const accessToken = jwt.sign(
		{
			_id: this._id,
			username: this.username,
			phoneNumber: this.phoneNumber,
			email: this.email,
		},
		JWT_SECRET_KEY,
		{ expiresIn: "15m" }
	);

	const refreshToken = randomBytes(64).toString("hex");

	return [accessToken, refreshToken];
};

module.exports = mongoose.model("users", UserSchema);
