const GroupRepository = require("../Repository/GroupRepository");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

module.exports.getUserGroups = catchAsyncErrors(async (req, res, next) => {
    const groupRepository = new GroupRepository();
    var userGroups = await groupRepository.getUserGroups();
    res.status(200).send(userGroups[0]);
});

module.exports.createUserGroup = catchAsyncErrors(async (req, res, next) => {
    const groupRepository = new GroupRepository();
    try {
        var userGroup = await groupRepository.createUserGroup(req.body.userGroup);
        console.log(userGroup);
        res.status(200).json({
            success: true,
            userGroup: req.body.userGroup,
        });
    } catch (err) {
        console.log(err.statusCode + err.message);
        if (err.statusCode === 409) {
            res.status(err.statusCode).json({ success: false, reason: "User Group Exists. Try a different User Group." });
            return next(err);
        }
    }
});
