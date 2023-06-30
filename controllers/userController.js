const User = require("../models/User");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../Utils/ErrorHandler");
const UserRepository = require("../Repository/UserRepository");

module.exports.createUser = catchAsyncErrors(async (req, res, next) => {
    var userRepository = new UserRepository();
    console.log(req.body);

    //create User Model
    var userToAdd = new User(req.body.username, req.body.password, req.body.email, req.body.active, req.body.userGroups);

    try {
        var results = await userRepository.createUser(userToAdd);
    } catch (err) {
        // res.status(err.statusCode).json({
        //     success: false,
        //     reason: err.message,
        // });
        next(err);
    }

    /* data format returned by createUser()
    var data = {
        success: true,
        username: user.username,
        createdUser: usersCreated, -> number of users created
        createdMappings: userGroupsMapCreated, -> nuber of groups added to accounts_usergroups
    };
    */

    if (results.createdUser === 0) {
        // res.status(422).json({
        //     success: false,
        //     reason: "Something went wrong. User was not created.",
        // });
        throw new ErrorHandler("Something went wrong. User was not created.", 422);
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
    var userRepository = new UserRepository();
    var users = await userRepository.getAllUsers();
    res.status(200).send(users);
});

module.exports.getUserByUsername = catchAsyncErrors(async (req, res, next) => {
    var userRepository = new UserRepository();
    var user = await userRepository.getUserByUsername(req.params.username);
    res.status(200).json(user[0]);
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
    console.log("update user hit");
    console.log(req.body);
    var username = req.params.username;
    var password = req.body.password;
    var email = req.body.email;
    var active = req.body.active;
    var userGroups = req.body.userGroups;

    var user = new User(username, password, email, active, userGroups);
    console.log(user);
    var userRepository = new UserRepository();
    try {
        var userUpdated = await userRepository.updateUser(user);
    } catch (err) {
        next(err);
    }

    var numberUsersUpdated = userUpdated[0].affectedRows;

    res.status(200).json({
        success: true,
        updated: username,
        updatedRows: numberUsersUpdated,
    });
});
