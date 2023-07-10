const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Task = require("../models/Task");
const Note = require("../models/Note");
const TaskRepository = require("../Repository/TaskRepository");
const ApplicationRepository = require("../Repository/ApplicationRepository");
const ErrorHandler = require("../Utils/ErrorHandler");

const { processStringNotesToArray } = require("../Utils/NotesUtil");

module.exports.createTask = catchAsyncErrors(async (req, res, next) => {
    const taskRepository = new TaskRepository();
    const applicationRepository = new ApplicationRepository();

    const { task_name, task_description, task_plan, task_app_acronym, task_creator } = req.body;
    var task_state = "open";
    var task_owner = task_creator;
    var application = await applicationRepository.getApplicationByAcronym(task_app_acronym);
    var appRnumber = application.app_Rnumber;
    var appAcronym = application.app_acronym;
    var task_id = task_app_acronym + "_" + appRnumber;

    //update new appRnumber
    await applicationRepository.updateAppRNumber(parseInt(appRnumber) + 1, appAcronym);
    var task_createdate = new Date();

    const task = new Task(task_name, task_description, "", task_id, task_plan, task_app_acronym, task_state, task_creator, task_owner, task_createdate);

    try {
        const createdTask = await taskRepository.createTask(task);
        res.status(200).json({
            success: true,
            task: createdTask,
        });
    } catch (err) {
        next(err);
    }
});

module.exports.getAllTasks = catchAsyncErrors(async (req, res, next) => {
    const appAcronym = req.query.app;
    const taskRepository = new TaskRepository();
    if (appAcronym) {
        console.log("getting all tasks");
        const tasks = await taskRepository.getAllTasksByAppAcronym(appAcronym);

        res.status(200).json(tasks);
    } else {
        const tasks = await taskRepository.getAllTasks();
        console.log("getting all tasks");
        res.status(200).json(tasks);
    }
});

module.exports.getTaskById = catchAsyncErrors(async (req, res, next) => {
    const { taskId } = req.params;
    const taskRepository = new TaskRepository();
    const task = await taskRepository.getTaskById(taskId);

    if (!task) {
        throw new ErrorHandler(`Task with name '${taskId}' not found.`, 404);
    }

    console.log(processStringNotesToArray(task.task_notes));

    res.status(200).json(task);
});

module.exports.deleteTask = catchAsyncErrors(async (req, res, next) => {
    const { taskId } = req.params;
    const taskRepository = new TaskRepository();
    const deleteResult = await taskRepository.deleteTask(taskId);

    if (deleteResult.affectedRows === 0) {
        throw new ErrorHandler(`Task with name '${taskId}' not found.`, 404);
    }

    res.status(200).json({
        success: true,
        deleted: taskId,
    });
});

module.exports.updateTask = catchAsyncErrors(async (req, res, next) => {
    const { taskId } = req.params;
    const { task_name, task_description, task_notes, task_plan, task_state, task_creator, task_owner } = req.body;

    // newNote = new Note(task_notes.content, task_notes.author, task_notes.createdate);

    const currDate = new Date();
    const taskRepository = new TaskRepository();

    var note = new Note(task_notes, req.body.verification.username, currDate.toLocaleString());

    var newNote = await taskRepository.addNoteToTask(taskId, note);
    console.log(newNote);
    // this.taskId = taskId;
    //     this.taskDescription = taskDescription;
    //     this.taskNotes = taskNotes;
    //     this.taskId = taskId;
    //     this.taskPlan = taskPlan;
    //     this.taskAppAcronym = taskAppAcronym;
    //     this.taskState = taskState;
    //     this.taskCreator = taskCreator;
    //     this.taskOwner = taskOwner;
    //     this.taskCreateDate = taskCreateDate;
    const updatedTaskData = { task_name, task_description, newNote, task_plan, task_state, task_creator, task_owner };

    try {
        const updateResult = await taskRepository.updateTask(updatedTaskData, taskId);

        if (updateResult.affectedRows === 0) {
            throw new ErrorHandler(`Task with name '${taskId}' not found.`, 404);
        }

        res.status(200).json({
            success: true,
            updated: taskId,
        });
    } catch (err) {
        next(err);
    }
});

module.exports.promoteTask = catchAsyncErrors(async (req, res, next) => {
    console.log("ran promoteTask");
    const taskRepository = new TaskRepository();
    const applicationRepository = new ApplicationRepository();

    const { taskId, username } = req.body;
    var permittedUserGroups = "";
    var permitted = false;
    try {
        var task = await taskRepository.getTaskById(taskId);
    } catch (err) {
        throw new ErrorHandler("failed to run getTaskById", 400);
    }

    var appAcronym = task.task_app_acronym;
    var taskState = task.task_state;
    var newState = req.newState;
    console.log(newState);

    //check if user is permitted to promote task
    // switch (taskState) {
    //     case "open":
    //         try {
    //             var permittedUserGroup = (await applicationRepository.getApplicationOpenPermits(appAcronym)).app_permit_open;
    //         } catch (err) {
    //             throw new ErrorHandler("Error getting permissions for open", 400);
    //         }
    //         try {
    //             permitted = await userIsPermitted(username, [permittedUserGroup]);
    //         } catch (err) {
    //             throw new ErrorHandler("Error check if user is permitted", 400);
    //         }
    //         newState = "todo";
    //         break;
    //     case "todo":
    //         try {
    //             var permittedUserGroup = (await applicationRepository.getApplicationToDoPermits(appAcronym)).app_permit_todo;
    //         } catch (err) {
    //             throw new ErrorHandler("Error getting permissions for open", 400);
    //         }
    //         try {
    //             permitted = await userIsPermitted(username, [permittedUserGroup]);
    //         } catch (err) {
    //             throw new ErrorHandler("Error check if user is permitted", 400);
    //         }
    //         newState = "doing";
    //         break;
    //     case "doing":
    //         try {
    //             var permittedUserGroup = (await applicationRepository.getApplicationDoingPermits(appAcronym)).app_permit_doing;
    //         } catch (err) {
    //             throw new ErrorHandler("Error getting permissions for open", 400);
    //         }
    //         try {
    //             permitted = await userIsPermitted(username, [permittedUserGroup]);
    //         } catch (err) {
    //             throw new ErrorHandler("Error check if user is permitted", 400);
    //         }
    //         newState = "done";
    //         break;
    //     case "done":
    //         try {
    //             var permittedUserGroup = (await applicationRepository.getApplicationDonePermits(appAcronym)).app_permit_done;
    //         } catch (err) {
    //             throw new ErrorHandler("Error getting permissions for open", 400);
    //         }
    //         try {
    //             permitted = await userIsPermitted(username, [permittedUserGroup]);
    //         } catch (err) {
    //             throw new ErrorHandler("Error check if user is permitted", 400);
    //         }
    //         newState = "closed";
    //         break;
    //     case "closed":
    //         throw new ErrorHandler("Task in closed cannot be promoted.", 400);
    //     default:
    //         throw new ErrorHandler("Task does not belong to any valid state.", 400);
    // }
    // if (!permitted) {
    //     throw new ErrorHandler("user is not permitted to promote this task.", 401);
    // }

    //perform promotion
    try {
        console.log(taskId, newState);
        var promoted = await taskRepository.promoteTask(taskId, newState);
    } catch (err) {
        throw new ErrorHandler("failed to promote task", 400);
    }
    console.log("promotion completed");

    res.status(200).json({ success: true, preState: taskState, newState: newState });
});

module.exports.demoteTask = catchAsyncErrors(async (req, res, next) => {
    console.log("ran promoteTask");
    const taskRepository = new TaskRepository();
    const applicationRepository = new ApplicationRepository();

    const { taskId, username } = req.body;
    var permittedUserGroups = "";
    var permitted = false;
    try {
        var task = await taskRepository.getTaskById(taskId);
    } catch (err) {
        throw new ErrorHandler("failed to run getTaskById", 400);
    }

    var appAcronym = task.task_app_acronym;
    var taskState = task.task_state;
    var newState = req.newState;
    console.log(newState);

    //perform promotion
    try {
        console.log(taskId, newState);
        var promoted = await taskRepository.promoteTask(taskId, newState);
    } catch (err) {
        throw new ErrorHandler("failed to promote task", 400);
    }
    console.log("promotion completed");

    res.status(200).json({ success: true, preState: taskState, newState: newState });
});
