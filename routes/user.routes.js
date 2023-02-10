const router = require("express").Router();
const UserController = require("../controllers/user.controllers");
const { verifyToken } = require("../middlewares/auth");
const validator = require("../middlewares/validator");

router.post("/signup", validator("signup"), UserController.signup);
router.post("/login", validator("login"), UserController.login);
router.post("/logout", verifyToken, UserController.logout);

module.exports = router;
