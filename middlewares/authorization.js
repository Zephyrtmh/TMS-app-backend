const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../Utils/ErrorHandler");
const UserRepository = require("../Repository/UserRepository");
const { checkGroup } = require("../Utils/AuthorizationUtils");

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
