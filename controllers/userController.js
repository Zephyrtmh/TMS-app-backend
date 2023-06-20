const authService = require("../services/authenticationService");
const User = require("../models/User");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../Utils/ErrorHandler");
const userService = require("../services/userService");

module.exports.createUser = catchAsyncErrors(async (req, res, next) => {
    var userToAdd = new User(0, req.body.username, req.body.password, req.body.email, req.body.active, req.body.userGroup);
    console.log(userToAdd);
    var userAdded = await userService.createUser(userToAdd);
    if (!userAdded) {
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

module.exports.getUserById = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;
    var user = await userService.getUserById(userId);
    console.log(user);
    res.status(200).json({
        userId: user.userId,
        username: user.username,
        email: user.email,
    });
});

module.exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    var users = await userService.getAllUsers();
    res.status(200).send(users);
});

module.exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    var usersDeleted = await userService.deleteUser(req.body.username);
    res.status(200).json({
        success: true,
        deleted: usersDeleted.affectedRows,
    });
});
