const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Task = require("../models/Task");
const TaskRepository = require("../Repository/TaskRepository");
const ApplicationRepository = require("../Repository/ApplicationRepository");

const UserRepository = require("../Repository/UserRepository");
const PlanRepository = require("../Repository/PlanRepository");
const bcrypt = require("bcryptjs");

module.exports.createTask_v2 = catchAsyncErrors(async (req, res, next) => {
    const { username, password, taskName, task_description, task_notes, task_plan, task_app_acronym } = req.body;

    const taskRepository = new TaskRepository();
    const applicationRepository = new ApplicationRepository();
    const userRepository = new UserRepository();
    const planRepository = new PlanRepository();

    if (Object.keys(req.query).length > 0) {
        return res.status(200).send({
            code: "E007",
        });
    }

    const expectedFields = ["username", "password", "task_app_acronym", "taskName", "task_plan", "task_notes", "task_description"];
    const receivedFields = Object.keys(req.body);

    const hasExtraFields = receivedFields.some((field) => !expectedFields.includes(field));

    if (hasExtraFields) {
        return res.status(200).send({ code: "E013" });
    }

    if (!username || !password || password === "") {
        return res.status(200).json({
            code: "E003",
        });
    }
    //check if taskname is valid
    if (!taskName || taskName === "") {
        return res.status(200).json({
            code: "E003",
        });
    }

    if (!task_app_acronym || task_app_acronym === "") {
        return res.status(200).json({
            code: "E003",
        });
    }
    try {
        var user = await userRepository.getUserByUsername(username);
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            code: "E004",
        });
    }

    const isValidCredentials = await bcrypt.compare(password, user[0].password);

    if (!isValidCredentials) {
        return res.status(200).json({
            code: "E004",
        });
    }

    //check if user is suspended
    if (user[0].isActive == 0) {
        return res.status(200).json({
            code: "E001",
        });
    }

    if (task_plan && task_plan != "") {
        var plan = await planRepository.getPlanByMVPName(task_plan);
        if (plan.length === 0) {
            return res.status(200).json({
                code: "E006",
            });
        }
    }

    var task_state = "open";
    var task_owner = username;
    try {
        var application = await applicationRepository.getApplicationByAcronym(task_app_acronym);
        if (!application) {
            return res.status(200).json({
                code: "E005",
            });
        }
    } catch (err) {}
    var appRnumber = application.app_Rnumber;
    var appAcronym = application.app_acronym;
    var task_id = task_app_acronym + "_" + appRnumber;

    //check for app_permit_create of application
    user = await userRepository.getUserByUsername(username);

    if (!user[0].userGroups.includes(application.app_permit_create)) {
        return res.status(200).json({
            code: "E002",
        });
    }
    if (task_notes && task_notes != "") {
        if (/\|/.test(task_notes)) {
            return res.status(200).json({
                code: "E012",
            });
        }
    }
    var formatted_task_notes = "";
    if (task_notes !== "") {
        formatted_task_notes = `${username} created the task|${task_state}|system|${new Date().toLocaleString()}|${task_notes}|${task_state}|${username}|${new Date().toLocaleString()}`;
    } else {
        formatted_task_notes = `${username} created the task|${task_state}|system|${new Date().toLocaleString()}`;
    }

    //update new appRnumber
    await applicationRepository.updateAppRNumber(parseInt(appRnumber) + 1, appAcronym);
    var task_createdate = new Date();
    console.log(formatted_task_notes);

    const task = new Task(taskName, task_description ? task_description : null, formatted_task_notes, task_id, task_plan === "" ? null : task_plan, task_app_acronym, task_state, username, task_owner, task_createdate);

    try {
        const createdTask = await taskRepository.createTask(task);
        res.status(200).json({
            taskId: task_id,
            code: "S001",
        });
    } catch (err) {
        next(err);
    }
});
