const router = require("express").Router();
const MessageController = require("../controllers/message.controllers.js");
const { verifyToken } = require("../middlewares/auth");
const validator = require("../middlewares/validator");

router.post(
	"/add",
	validator("createMessage"),
	verifyToken,
	MessageController.createMessage
);

router.get(
    "/all/:receiverId",
    verifyToken,
    MessageController.getAllMessages
)

module.exports = router;
