const { authenticateUser } = require("../middlewares/jwtAuthenticate");

const express = require("express");
const router = express.Router();

const { loginUser, logoutUser, verifyUser, verifyUserWithHeaders } = require("../controllers/authenticationController");

router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/verifyuser").post(verifyUser);

module.exports = router;
