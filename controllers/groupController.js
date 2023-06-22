const GroupRepository = require("../Repository/GroupRepository");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

module.exports.getUserGroups = catchAsyncErrors(async (req, res, next) => {
    const groupRepository = new GroupRepository();
    var userGroups = await groupRepository.getUserGroups();
    res.status(200).send(userGroups[0]);
});

module.exports.createUserGroup = catchAsyncErrors(async (req, res, next) => {});
