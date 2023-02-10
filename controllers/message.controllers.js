const UserModel = require("../models/user.model");
const MessageModel = require("../models/message.model");

module.exports.createMessage = async (req, res) => {
	const senderId = req.user._id;
	const { receiverId, content } = req.body;

	if (
		!(await UserModel.findById(senderId)) ||
		!(await UserModel.findById(receiverId))
	)
		return res.status(400).send("Utilisateur non trouvé");

	const message = await MessageModel.create({ senderId, receiverId, content });

	return res.status(201).send(message.toJSON());
};
