const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { randomBytes } = require("crypto");
require("dotenv").config({ path: "../config/.env" });

const { JWT_ACCESS_TOKEN } = process.env;

const UserSchema = new mongoose.Schema(
	{
		username: {
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
		sessions: [
			{
				refreshToken: {
					type: String,
					required: true,
				},
				expiresAt: {
					type: Number,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

/* STATIC METHODS */

UserSchema.statics.findByIdAndRefreshToken = function (_id, refreshToken) {
	return this.findOne({
		_id,
		"sessions.refreshToken": refreshToken,
	});
};

/* INSTANCE METHODS */

UserSchema.methods.toJSON = function () {
	return _.omit(this.toObject(), ["password", "sessions", "__v", "updatedAt"]);
};

UserSchema.methods.generateTokens = function () {
	return [this.generateAccessToken(), this.generateRefreshToken()];
};

UserSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			username: this.username,
			email: this.email,
		},
		JWT_ACCESS_TOKEN,
		{ expiresIn: "15m" }
	);
};

UserSchema.methods.generateRefreshToken = function () {
	return randomBytes(64).toString("hex");
};

UserSchema.methods.addSession = function (refreshToken) {
	const daysBeforeExpireDate = 365; //1 year
	this.sessions.push({
		refreshToken,
		expiresAt: Date.now() + daysBeforeExpireDate * 24 * 60 * 60 * 1000,
	});
	this.save();
};

UserSchema.methods.removeSession = function (refreshToken) {
	this.sessions = this.sessions.filter(
		(token) => token.refreshToken !== refreshToken
	);
	this.save();
};

UserSchema.methods.findSessionByRefreshToken = function (refreshToken) {
	return this.sessions.find((session) => session.refreshToken === refreshToken);
};

module.exports = mongoose.model("users", UserSchema);
