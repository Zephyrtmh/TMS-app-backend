const express = require("express");
const router = express.Router();

const { createTask_v2 } = require("../microservices/createTask_v2");
const { getTaskByState } = require("../microservices/getTaskByState");
const { promoteTask2Done } = require("../microservices/promoteTask2Done");

router.route("/createTask").post(createTask_v2);
router.route("/getTaskByState").post(getTaskByState);
router.route("/promoteTask2Done").patch(promoteTask2Done);
module.exports = router;
