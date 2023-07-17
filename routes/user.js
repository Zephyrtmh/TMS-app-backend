const express = require("express");
const router = express.Router();

const { createUser, getAllUsers, deleteUser, updateUser, deactivateUser, activateUser, getUserByUsername } = require("../controllers/userController");
const { verifyUser } = require("../controllers/authenticationController");
const { authenticateUser } = require("../middlewares/jwtAuthenticate");
const { accessUserDetails } = require("../middlewares/authorization");

router.route("/user/:username").put(verifyUser, accessUserDetails, updateUser);
router.route("/user/create").post(createUser);
// router.route("/user/delete").post(verifyUser, deleteUser);
router.route("/user/deactivate").post(verifyUser, deactivateUser);
router.route("/user/activate").post(verifyUser, activateUser);
router.route("/user/all").post(verifyUser, getAllUsers);
router.route("/user/:username").post(verifyUser, getUserByUsername); //authenticateUser, accessUserDetails,

module.exports = router;
