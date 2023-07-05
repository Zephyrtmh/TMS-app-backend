const catchAsyncErrors = require("./catchAsyncErrors");
const jsonwebtoken = require("jsonwebtoken");
const ErrorHandler = require("../Utils/ErrorHandler");
const { verifyJWToken } = require("../Utils/AuthUtils");

module.exports.authenticateUser = catchAsyncErrors(async (req, res, next) => {
    //get jwToken from http-only cookie
    const jwToken = req.cookies.jwToken;
    console.log(req.cookies);
    console.log(jwToken);
    if (!jwToken) {
        throw new ErrorHandler("Login to access this service", 401);
    }
    var username = await verifyJWToken(jwToken);
    if (username) {
        next();
    } else {
        throw new ErrorHandler("Login to access this service", 401);
    }
});
