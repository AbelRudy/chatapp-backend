const Validators = require("../validators");

module.exports = function (validator) {
	//! If validator is not exist, throw err
	if (!Validators.hasOwnProperty(validator))
		throw new Error(`'${validator}' validator is not exist`);

	return async function (req, res, next) {
		try {
			const validated = await Validators[validator].validateAsync(req.body);
			req.body = validated;
			next();
		} catch (err) {
			if (err.isJoi)
				return res.status(422).send(err.message);
			return res.status(500).send("Erreur interne du serveur. Veuillez réessayer");
		}
	};
};
