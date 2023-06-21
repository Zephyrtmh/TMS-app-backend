const express = require("express");
const router = express.Router();

const { createUser, getAllUsers, deleteUser, updateUser, deactivateUser, activateUser } = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/jwtAuthenticate");

router.route("/user/create").post(authenticateUser, createUser);
router.route("/user/delete").post(authenticateUser, deleteUser);
router.route("/user/deactivate").post(authenticateUser, deactivateUser);
router.route("/user/activate").post(authenticateUser, activateUser);
router.route("/user/update").post(authenticateUser, updateUser);
router.route("/user/all").get(authenticateUser, getAllUsers);

module.exports = router;
