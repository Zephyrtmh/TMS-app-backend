const express = require("express");
const router = express.Router();

const { createUser, getUserById, getAllUsers, deleteUser } = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/jwtAuthenticate");

router.route("/user/create").post(authenticateUser, createUser);
router.route("/user/delete").post(authenticateUser, deleteUser);
router.route("/user/:id").get(authenticateUser, getUserById);
router.route("/user").get(authenticateUser, getAllUsers);

module.exports = router;
