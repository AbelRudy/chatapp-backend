const UserModel = require("../models/user.model");
const MessageModel = require("../models/message.model");

module.exports.createMessage = async (req, res) => {
	const senderId = req.user._id;
	const { receiverId, content } = req.body;

	//The auth middleware didn't throw an error, so we don't need to verify if the senderId exists
	if (!(await UserModel.findById(receiverId)))
		return res.status(404).send("Utilisateur non trouvé");

	const message = await MessageModel.create({ senderId, receiverId, content });

	return res.status(201).send(message.toJSON());
};

module.exports.getAllMessages = async (req, res) => {
	const senderId = req.user._id;
	const { receiverId } = req.params;

	//The auth middleware didn't throw an error, so we don't need to verify if the senderId exists
	if (!(await UserModel.findById(receiverId)))
		return res.status(404).send("Utilisateur non trouvé");

	const messages = await MessageModel.find({ senderId, receiverId });

	return res.status(200).send(messages.map((message) => message.toJSON()));
};