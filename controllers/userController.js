const authService = require("../services/authenticationService");
const User = require("../models/User");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../Utils/ErrorHandler");
const userService = require("../services/userService");
const UserRepository = require("../Repository/UserRepository");

module.exports.createUser = catchAsyncErrors(async (req, res, next) => {
    var userRepository = new UserRepository();

    //create User Model
    var userToAdd = new User(req.body.username, req.body.password, req.body.email, req.body.active, req.body.userGroupId);

    var userCreated = await userRepository.createUser(userToAdd);
    var numberUsersCreated = userCreated[0];
    console.log(numberUsersCreated);

    if (!numberUsersCreated) {
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
    var userDeleted = await userRepository.deactivateUser(username);
    var numberUsersDeleted = userDeleted[0].affectedRows;

    res.status(200).json({
        success: true,
        deleted: username,
        updatedRows: numberUsersDeleted,
    });
});

module.exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var active = req.body.active;
    var userGroupId = req.body.userGroupId;

    var user = new User(username, password, email, active, userGroupId);

    var userRepository = new UserRepository();
    var userUpdated = await userRepository.updateUser(user);
    var numberUsersUpdated = userUpdated[0].affectedRows;

    res.status(200).json({
        success: true,
        updated: username,
        updatedRows: numberUsersUpdated,
    });
});
