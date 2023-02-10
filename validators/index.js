const UserValidator = require("./user.validators");
const MessageValidator = require("./message.validators");

module.exports = {
	...UserValidator,
	...MessageValidator,
};
