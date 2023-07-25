const express = require("express");
const router = express.Router();

const { createTask, getAllTasks, getTaskById, deleteTask, updateTask, promoteTask, demoteTask } = require("../controllers/taskController");
const { createTask_v2 } = require("../microservices/createTask_v2");
const { getTaskByState } = require("../microservices/getTaskByState");
const { verifyUser } = require("../controllers/authenticationController");
const { authenticateUser } = require("../middlewares/jwtAuthenticate");
const { accessUserDetails, canEditTask } = require("../middlewares/authorization");
const { promoteTask2Done } = require("../microservices/promoteTask2Done");

router.route("/task/:taskId").put(verifyUser, updateTask);
router.route("/task/create").post(verifyUser, createTask);
router.route("/task/delete/:taskId").delete(verifyUser, accessUserDetails, deleteTask);
router.route("/task/all").post(verifyUser, getAllTasks);
router.route("/task/promote").post(verifyUser, canEditTask, promoteTask);
router.route("/task/demote").post(verifyUser, canEditTask, demoteTask);
router.route("/task/:taskId").post(verifyUser, canEditTask, getTaskById); //authenticateUser, accessUserDetails,

router.route("/createTask").post(createTask_v2);
router.route("/getTaskByState").post(getTaskByState);
router.route("/promoteTask2Done").patch(promoteTask2Done);
module.exports = router;
