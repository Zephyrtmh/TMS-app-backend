const express = require("express");
const router = express.Router();

const { createUser, getAllUsers, deleteUser, updateUser, deactivateUser, activateUser, getUserByUsername } = require("../controllers/userController");
const { verifyUser } = require("../controllers/authenticationController");
const { authenticateUser } = require("../middlewares/jwtAuthenticate");
const { accessUserDetails } = require("../middlewares/authorization");

router.route("/user/:username").put(verifyUser, accessUserDetails, updateUser);
router.route("/user/create").post(verifyUser, createUser);
router.route("/user/delete").post(authenticateUser, deleteUser);
router.route("/user/deactivate").post(authenticateUser, deactivateUser);
router.route("/user/activate").post(authenticateUser, activateUser);
router.route("/user/all").get(authenticateUser, getAllUsers);
// router.route("/user/:username").post(
//     authenticateUser,
//     (req, res, next) => {
//         authorizeForUserGroups(req, res, next, ["admin"]);
//     },
//     accessUserDetails,
//     getUserByUsername
// );
router.route("/user/:username").post(getUserByUsername); //authenticateUser, accessUserDetails,

module.exports = router;
