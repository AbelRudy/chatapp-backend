const joi = require("joi");

module.exports.createMessage = joi.object({
	receiverId: joi.string().required(),
	content: joi.string().required(),
});
