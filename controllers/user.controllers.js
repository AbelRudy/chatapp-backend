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

		return res.status(201).send({ status: "created", data: user.toJSON() });
	} catch (error) {
		console.log(error);
		//error : duplicate username
		if (Object.keys(error.keyValue)[0].includes("username"))
			return res.status(409).send({
				status: "error : conflict",
				message: "Un compte existe déjà avec ce username.",
			});
		//error : duplicate email
		if (Object.keys(error.keyValue)[0].includes("email"))
			return res.status(409).send({
				status: "error : conflict",
				message: "Un compte existe déjà avec cet email.",
			});
		//error : duplicate phone number
		if (Object.keys(error.keyValue)[0].includes("phone"))
			return res.status(409).send({
				status: "error : conflict",
				message: "Un compte existe déjà avec ce numéro de téléphone.",
			});

		return res.status(500).send({
			status: "error : internal server error",
			message: "Erreur interne du serveur. Veuillez réessayer svp.",
		});
	}
};

module.exports.login = async (req, res) => {
	try {
		const { username, email, phoneNumber, password } = req.body;
		let user = null;

		if (phoneNumber) {
			//login by phone number
			user = await UserModel.findOne({ phoneNumber });

			if (!user)
				return res.status(404).send({
					status: "error : not found",
					message:
						"numéro de téléphone ou mot de passe incorrect. Veuillez réessayer svp",
				});
		} else if (username) {
			//login by username
			user = await UserModel.findOne({ username });

			if (!user)
				return res.status(404).send({
					status: "error : not found",
					message:
						"nom d'utilisateur ou mot de passe incorrect. Veuillez réessayer svp",
				});
		} else if (email) {
			//login by email
			user = await UserModel.findOne({ email });

			if (!user)
				return res.status(404).send({
					status: "error : not found",
					message: "email ou mot de passe incorrect. Veuillez réessayer svp",
				});
		}

		bcrypt.compare(password, user.password, (err) => {
			if (err)
				return res.status(404).send({
					status: "error : not found",
					message:
						"nom d'utilisateur ou mot de passe incorrect. Veuillez réessayer svp",
				});
			const [accessToken, refreshToken] = user.generateTokens();

			user.sessions.push({
				refreshToken,
				expiresAt: Date.now() / 1000 + 30 * 24 * 60 * 60, //today + 30 days
			});

			user.save(); //To save the refresh token in db

			return res.status(200).send({
				status: "success",
				data: {
					...user.toJSON(),
					tokens: {
						accessToken,
						refreshToken,
					},
				},
			});
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: "error : internal server error",
			message: "Erreur interne du serveur. Veuillez réessayer svp.",
		});
	}
};
