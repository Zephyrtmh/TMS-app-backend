const express = require("express");
const router = express.Router();

const { loginUser } = require("../controllers/authenticationContoller");

router.route("/login").post(loginUser);

module.exports = router;
