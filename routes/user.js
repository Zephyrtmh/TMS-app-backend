const express = require("express");
const router = express.Router();

const { createUser, getAllUsers, deleteUser, updateUser, deactivateUser } = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/jwtAuthenticate");

router.route("/user/create").post(createUser);
router.route("/user/delete").post(deleteUser);
router.route("/user/deactivate").post(deactivateUser);
router.route("/user/update").post(updateUser);
router.route("/user").get(authenticateUser, getAllUsers);

module.exports = router;
