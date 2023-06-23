const { authenticateUser } = require("../middlewares/jwtAuthenticate");

const express = require("express");
const router = express.Router();

const { loginUser, logoutUser, verifyUser } = require("../controllers/authenticationContoller");

router.route("/login").post(loginUser);
router.route("/logout").post(authenticateUser, logoutUser);
router.route("/verifyuser").post(verifyUser);

module.exports = router;
