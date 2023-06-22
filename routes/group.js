const express = require("express");
const router = express.Router();

const { getUserGroups, createUserGroup } = require("../controllers/groupController");
const { authenticateUser } = require("../middlewares/jwtAuthenticate");

router.route("/group/all").get(authenticateUser, getUserGroups);
router.route("/group/create").post(authenticateUser, createUserGroup);

module.exports = router;
