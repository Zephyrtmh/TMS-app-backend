const GroupRepository = require("../Repository/GroupRepository");
const UserRepository = require("../Repository/UserRepository");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

module.exports.getUserGroups = catchAsyncErrors(async (req, res, next) => {
    const groupRepository = new GroupRepository();
    var userGroups = await groupRepository.getUserGroups();
    res.status(200).send(userGroups[0]);
});

module.exports.createUserGroup = catchAsyncErrors(async (req, res, next) => {
    const userRepository = new UserRepository();
    var user = await userRepository.getUserByUsername(req.body.verification.username);
    //TODO: implement check group here
    if (!user[0].userGroups.includes("admin")) {
        throw new ErrorHandler("User not permitted to create UserGroup", 401);
    }
    const groupRepository = new GroupRepository();
    try {
        var userGroup = req.body.userGroup;
        if (userGroup.length > 50) {
            throw new ErrorHandler("Usergroup cannot be longer than 50 characters.");
        } else if (userGroup.length === 0) {
            throw new ErrorHandler("Usergroup cannot be blank");
        }
        var userGroup = await groupRepository.createUserGroup(userGroup);
        console.log(userGroup);
        res.status(200).json({
            success: true,
            userGroups: req.body.userGroup,
        });
    } catch (err) {
        if (err.statusCode === 409) {
            throw new ErrorHandler("Usergroup already exists.", 409);
        } else {
            throw err;
        }
    }
});
