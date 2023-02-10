const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");

module.exports.signup = async (req, res) => {
	const { username, phoneNumber, email, password } = req.body;

	try {
		const salt = await bcrypt.genSalt();
		const encryptedPassword = await bcrypt.hash(password, salt);

		const user = await UserModel.create({
			username,
			phoneNumber,
			email,
			password: encryptedPassword,
		});

		return res.status(201).send(user.toJSON());
	} catch (error) {
		console.log(error);
		//error : duplicate username
		if (Object.keys(error.keyValue)[0].includes("username"))
			return res.status(409).send("Un compte existe déjà avec ce username.");
		//error : duplicate email
		if (Object.keys(error.keyValue)[0].includes("email"))
			return res.status(409).send("Un compte existe déjà avec cet email.");
		//error : duplicate phone number
		if (Object.keys(error.keyValue)[0].includes("phone"))
			return res
				.status(409)
				.send("Un compte existe déjà avec ce numéro de téléphone.");

		return res
			.status(500)
			.send("Erreur interne du serveur. Veuillez réessayer svp.");
	}
};

module.exports.login = async (req, res) => {
	try {
		const { username, email, phoneNumber, password } = req.body;
		let user = null;

		if (phoneNumber) {
			//login by phone number
			user = await UserModel.findOne({ phoneNumber });
		} else if (username) {
			//login by username
			user = await UserModel.findOne({ username });
		} else if (email) {
			//login by email
			user = await UserModel.findOne({ email });
		}

		bcrypt.compare(password, user?.password, (err) => {
			if (err)
				return res
					.status(404)
					.send(
						"nom d'utilisateur ou mot de passe incorrect. Veuillez réessayer svp"
					);
			const [accessToken, refreshToken] = user.generateTokens();

			user.addSession(refreshToken);

			return res
				.status(200)
				.set({
					"Authorization": accessToken,
					"x-refresh-token": refreshToken,
				})
				.send({
					...user.toJSON(),
				});
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.send("Erreur interne du serveur. Veuillez réessayer svp.");
	}
};

module.exports.logout = async (req, res) => {
	const refreshToken = req.header("x-refresh-token");
	const userId = req.header("x-id");

	const user = await UserModel.findById(userId);

	user.removeSession(refreshToken);

	console.log(user);

	res.status(200).send(user);
};
