const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config/.env" });

const { JWT_ACCESS_TOKEN } = process.env;

module.exports.verifyToken = async function (req, res, next) {
	let accessToken = req.header("Authorization");
	let refreshToken = req.header("x-refresh-token");
	let userId = req.header("x-id");

	if (!accessToken || !refreshToken || !userId) {
		return res.status(401).send("Problème d'authentification");
	}

	try {
		accessToken = accessToken.replace(/^Bearer\s+/, "");
		req.user = jwt.verify(accessToken, JWT_ACCESS_TOKEN);
		return next();
	} catch (error) {
		//An error can be "expired access token"
		//So we refresh this access token
		const user = await UserModel.findByIdAndRefreshToken(userId, refreshToken);

		if (!user) {
			return res.status(401).send("Problème d'authentification");
		}

		//Check if the refresh token is still valid
		const session = user.findSessionByRefreshToken(refreshToken);
		if (session) {
			if (session.expiresAt > Date.now()) {
				//refresh token is valid
				//We generate a new accesstoken
				accessToken = user.generateAccessToken();
				req.headers["Authorization"] = accessToken;
				res.set("Authorization", accessToken);
				req.user = user;
				return next();
			} else {
				//refresh token invalid
				user.removeSession(refreshToken);
				return res.status(401).send("Problème d'authentification");
			}
		}

		//No refresh token at all, just throw an error
		return res.status(401).send("Problème d'authentification");
	}
};
