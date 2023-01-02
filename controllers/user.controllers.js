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

		return res
			.status(201)
			.send({ status: "created", data: user.getUserInfos() });
	} catch (error) {
		console.log(error);
		//error : duplicate username
		if (error.keyValue.contains("username"))
			return res.status(409).send({
				status: "error : conflict",
				message: "Un compte existe déjà avec ce username.",
			});
		//error : duplicate email
		if (error.keyValue.contains("email"))
			return res.status(409).send({
				status: "error : conflict",
				message: "Un compte existe déjà avec cet e-mail.",
			});
		//error : duplicate phone number
		if (error.keyValue.contains("phone"))
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
