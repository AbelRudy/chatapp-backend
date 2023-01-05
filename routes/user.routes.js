const router = require("express").Router();
const UserController = require("../controllers/user.controllers");
const validator = require("../middlewares/validator")

router.post("/signup", validator("signup"), UserController.signup);
router.post("/login", validator("login"), UserController.login);

module.exports = router;
