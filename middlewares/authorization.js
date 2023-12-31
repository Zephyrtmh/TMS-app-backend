const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../Utils/ErrorHandler");
const UserRepository = require("../Repository/UserRepository");
const { checkGroup } = require("../Utils/AuthorizationUtils");
const TaskRepository = require("../Repository/TaskRepository");
const ApplicationRepository = require("../Repository/ApplicationRepository");
const { userIsPermitted } = require("../Utils/AuthorizationUtils");

module.exports.accessUserDetails = catchAsyncErrors(async (req, res, next) => {
    /*
    {
        username: username
    }
    */
    var username = req.body.verification.username;

    const userRepository = new UserRepository();
    //verify user details
    var user = await userRepository.getUserByUsername(username);
    //to access user details either userGroup = admin or trying to access own user profile
    if (checkGroup(user[0].username, "admin")) {
        return next();
    } else if (user[0][0].username === req.params.username) {
        return next();
    } else {
        throw new ErrorHandler("Not Authorized to view this user profile", 401);
    }
});

module.exports.canEditTask = catchAsyncErrors(async (req, res, next) => {
    console.log("ran canEditTask");
    const taskRepository = new TaskRepository();
    const applicationRepository = new ApplicationRepository();

    const username = req.body.verification.username;
    console.log(req.params);
    const taskId = req.body.taskId || req.params.taskId;
    console.log(username, taskId);
    const action = req.body.action || req.query.action;

    var permittedUserGroups = "";
    var permitted = false;
    var task = await taskRepository.getTaskById(taskId);
    var appAcronym = task.task_app_acronym;
    var taskState = task.task_state;
    var newState = "";
    console.log("taskState", taskState);

    //check if user is permitted to promote task
    switch (taskState) {
        case "open":
            try {
                var permittedUserGroup = (await applicationRepository.getApplicationOpenPermits(appAcronym)).app_permit_open;
            } catch (err) {
                throw new ErrorHandler("Error getting permissions for open", 400);
            }
            try {
                permitted = await userIsPermitted(username, [permittedUserGroup]);
            } catch (err) {
                throw new ErrorHandler("Error check if user is permitted", 401);
            }
            if (action) {
                if (action === "promote") {
                    newState = "todo";
                } else if (action === "demote") {
                    throw new ErrorHandler("task in open state cannot be demoted");
                }
            }
            break;
        case "todo":
            try {
                var permittedUserGroup = (await applicationRepository.getApplicationToDoPermits(appAcronym)).app_permit_todo;
            } catch (err) {
                throw new ErrorHandler("Error getting permissions for open", 401);
            }
            try {
                permitted = await userIsPermitted(username, [permittedUserGroup]);
            } catch (err) {
                throw new ErrorHandler("Error check if user is permitted", 401);
            }
            console.log("action", action);
            if (action) {
                if (action === "promote") {
                    newState = "doing";
                } else if (action === "demote") {
                    console.log("this was ran");
                    return new ErrorHandler("task in todo state cannot be demoted to open", 401);
                }
            }
            break;
        case "doing":
            try {
                var permittedUserGroup = (await applicationRepository.getApplicationDoingPermits(appAcronym)).app_permit_doing;
            } catch (err) {
                throw new ErrorHandler("Error getting permissions for open", 401);
            }
            try {
                permitted = await userIsPermitted(username, [permittedUserGroup]);
            } catch (err) {
                throw new ErrorHandler("Error check if user is permitted", 401);
            }
            if (action) {
                if (action === "promote") {
                    newState = "done";
                } else if (action === "demote") {
                    newState = "todo";
                }
            }
            break;
        case "done":
            console.log("task is in done");
            try {
                var permittedUserGroup = (await applicationRepository.getApplicationDonePermits(appAcronym)).app_permit_done;
            } catch (err) {
                throw new ErrorHandler("Error getting permissions for open", 400);
            }
            try {
                permitted = await userIsPermitted(username, [permittedUserGroup]);
            } catch (err) {
                throw new ErrorHandler("Error check if user is permitted", 400);
            }
            console.log("action", action);
            if (action) {
                if (action === "promote") {
                    console.log("state is closed");
                    newState = "closed";
                } else if (action === "demote") {
                    newState = "doing";
                }
            }
            break;
        case "closed":
            throw new ErrorHandler("Task in closed cannot be promoted.", 400);
        default:
            throw new ErrorHandler("Task does not belong to any valid state.", 400);
    }
    if (!permitted) {
        throw new ErrorHandler("Not Authorized to view this user profile", 401);
    } else {
        console.log("this was promoted");
        req.newState = newState;
        console.log("newState", newState);
        next();
    }
});
