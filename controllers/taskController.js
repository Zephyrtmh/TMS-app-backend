const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Task = require("../models/Task");
const TaskRepository = require("../Repository/TaskRepository");
const ApplicationRepository = require("../Repository/ApplicationRepository");
const ErrorHandler = require("../Utils/ErrorHandler");

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
    const taskRepository = new TaskRepository();
    const tasks = await taskRepository.getAllTasks();
    res.status(200).json(tasks);
});

module.exports.getTaskByName = catchAsyncErrors(async (req, res, next) => {
    const { taskId } = req.params;
    const taskRepository = new TaskRepository();
    const task = await taskRepository.getTaskByName(taskId);

    if (!task) {
        throw new ErrorHandler(`Task with name '${taskId}' not found.`, 404);
    }

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
    const updatedTaskData = { task_name, task_description, task_notes, task_plan, task_state, task_creator, task_owner };

    const taskRepository = new TaskRepository();

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
