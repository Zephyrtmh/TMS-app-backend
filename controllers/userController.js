const authService = require("../services/authenticationService");
const User = require("../models/User");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../Utils/ErrorHandler");
const userService = require("../services/userService");
const UserRepository = require("../Repository/UserRepository");

module.exports.createUser = catchAsyncErrors(async (req, res, next) => {
    var userRepository = new UserRepository();

    //create User Model
    console.log(req.body);
    var userToAdd = new User(req.body.username, req.body.password, req.body.email, req.body.active, req.body.userGroup);

    try {
        var userCreated = await userRepository.createUser(userToAdd);
    } catch (err) {
        console.log(err);
        res.status(err.statusCode).json({
            success: false,
            reason: err.message,
        });
        return next(err);
    }

    var numberUsersCreated = userCreated[0].affectedRows;

    if (numberUsersCreated === 0) {
        res.status(422).json({
            success: false,
            reason: "Something went wrong. User was not created.",
        });
    }
    res.status(200).json({
        success: true,
        user: {
            username: userToAdd.username,
            email: userToAdd.email,
        },
    });
});

module.exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    var users = await userService.getAllUsers();
    res.status(200).send(users);
});

module.exports.getUserByUsername = catchAsyncErrors(async (req, res, next) => {
    var userRepository = new UserRepository();
    var user = await userRepository.getUserByUsername(req.params.username);
    res.status(200).send(user[0][0]);
});

module.exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const username = req.body.username;
    var userRepository = new UserRepository();
    var userDeleted = await userRepository.deleteUser(username);
    var numberUsersDeleted = userDeleted[0].affectedRows;

    res.status(200).json({
        success: true,
        deleted: username,
        updatedRows: numberUsersDeleted,
    });
});

module.exports.deactivateUser = catchAsyncErrors(async (req, res, next) => {
    const username = req.body.username;
    var userRepository = new UserRepository();
    var userDeactivated = await userRepository.deactivateUser(username);
    var numberUserDeactivated = userDeactivated[0].affectedRows;

    res.status(200).json({
        success: true,
        deleted: username,
        updatedRows: numberUserDeactivated,
    });
});

module.exports.activateUser = catchAsyncErrors(async (req, res, next) => {
    const username = req.body.username;
    var userRepository = new UserRepository();
    var userActivated = await userRepository.activateUser(username);
    var numberUserActivated = userActivated[0].affectedRows;

    res.status(200).json({
        success: true,
        deleted: username,
        updatedRows: numberUserActivated,
    });
});

module.exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    var username = req.params.username;
    var password = req.body.password;
    var email = req.body.email;
    var active = req.body.active;
    var userGroup = req.body.userGroup;

    var user = new User(username, password, email, active, userGroup);

    var userRepository = new UserRepository();
    var userUpdated = await userRepository.updateUser(user, req.body.changePassword);
    var numberUsersUpdated = userUpdated[0].affectedRows;

    res.status(200).json({
        success: true,
        updated: username,
        updatedRows: numberUsersUpdated,
    });
});
