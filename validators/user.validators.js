const joi = require("joi");

module.exports.signup = joi.object({
	//username with digits and and (upper/lower) letters
	username: joi
		.string()
		.regex(/^[a-zA-Z0-9]{3,50}$/)
		.required(),
	email: joi.string().email().lowercase().required(),
	/**
	 * Between 8 and 15 characters,
	 * At least one upper letter,
	 * At least one lower
	 */
	password: joi
		.string()
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
		)
		.required(),
});

module.exports.login = joi
	.object({
		//username with digits and and (upper/lower) letters
		username: joi.string().regex(/^[a-zA-Z0-9]{3,50}$/),
		email: joi.string().email().lowercase(),
		password: joi
			.string()
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
			)
			.required(),
	})
	.xor("username", "email");
