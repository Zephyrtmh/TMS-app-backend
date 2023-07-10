const express = require("express");
const router = express.Router();

const { getUserGroups, createUserGroup } = require("../controllers/groupController");
const { verifyUser } = require("../controllers/authenticationController");

router.route("/group/all").post(verifyUser, getUserGroups);
router.route("/group/create").post(verifyUser, createUserGroup);

module.exports = router;
