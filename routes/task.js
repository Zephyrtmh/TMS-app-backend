const express = require("express");
const router = express.Router();

const { createTask, getAllTasks, getTaskByName, deleteTask, updateTask } = require("../controllers/taskController");
const { verifyUser } = require("../controllers/authenticationController");
const { authenticateUser } = require("../middlewares/jwtAuthenticate");
const { accessUserDetails } = require("../middlewares/authorization");

router.route("/task/:taskId").put(verifyUser, accessUserDetails, updateTask);
router.route("/task/create").post(verifyUser, createTask);
router.route("/task/delete/:taskId").delete(verifyUser, accessUserDetails, deleteTask);
router.route("/task/all").post(verifyUser, getAllTasks);
router.route("/task/:taskId").get(getTaskByName); //authenticateUser, accessUserDetails,

module.exports = router;
