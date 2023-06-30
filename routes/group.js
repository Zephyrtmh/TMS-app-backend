const express = require("express");
const router = express.Router();

const { getUserGroups, createUserGroup } = require("../controllers/groupController");
const { verifyUser } = require("../controllers/authenticationController");
const { authenticateUser } = require("../middlewares/jwtAuthenticate");

router.route("/group/all").get(authenticateUser, getUserGroups);
router.route("/group/create").post(verifyUser, createUserGroup);

module.exports = router;
