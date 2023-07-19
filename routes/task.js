const express = require("express");
const router = express.Router();

const { createTask, getAllTasks, getTaskById, deleteTask, updateTask, promoteTask, demoteTask } = require("../controllers/taskController");
const { verifyUser } = require("../controllers/authenticationController");
const { authenticateUser } = require("../middlewares/jwtAuthenticate");
const { accessUserDetails, canEditTask } = require("../middlewares/authorization");

router.route("/task/:taskId").put(verifyUser, updateTask);
router.route("/task/create").post(verifyUser, createTask);
router.route("/task/delete/:taskId").delete(verifyUser, accessUserDetails, deleteTask);
router.route("/task/all").post(verifyUser, getAllTasks);
router.route("/task/promote").post(verifyUser, canEditTask, promoteTask);
router.route("/task/demote").post(verifyUser, canEditTask, demoteTask);
router.route("/task/:taskId").post(verifyUser, canEditTask, getTaskById); //authenticateUser, accessUserDetails,

module.exports = router;
