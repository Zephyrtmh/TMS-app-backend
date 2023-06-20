const catchAsyncErrors = require("./catchAsyncErrors");
const jsonwebtoken = require("jsonwebtoken");
const ErrorHandler = require("../Utils/ErrorHandler");
const { verifyJWToken } = require("../services/authenticationService");

module.exports.authenticateUser = catchAsyncErrors(async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        var token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ErrorHandler("Login to access this feature", 401));
    }
    var username = await verifyJWToken(token);
    console.log(username);
    if (username) {
        next();
    } else {
        throw new ErrorHandler("Login to access this service", 401);
    }
});
