const catchAsyncErrors = require("./catchAsyncErrors");
const jsonwebtoken = require("jsonwebtoken");
const ErrorHandler = require("../Utils/ErrorHandler");
const { verifyJWToken } = require("../Utils/AuthUtils");
const UserRepository = require("../Repository/UserRepository");

module.exports.accessUserDetails = catchAsyncErrors(async (req, res, next) => {
    /*
    {
        username: username
    }
    */
    var username = req.body.username;

    const userRepository = new UserRepository();
    //verify user details
    var user = await userRepository.getUserByUsername(username);
    //to access user details either userGroup = admin or trying to access own user profile
    console.log(user[0]);

    if (user[0][0].userGroup === "admin") {
        next();
    } else if (user[0][0].username === req.params.username) {
        next();
    } else {
        throw new ErrorHandler("Not Authorized to view this user profile", 401);
    }
});
