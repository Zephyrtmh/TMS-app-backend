const authService = require("../services/authenticationService");
const User = require("../models/User");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const UserRepository = require("../Repository/UserRepository");
const ErrorHandler = require("../Utils/ErrorHandler");

const authUtils = require("../Utils/AuthUtils");
const jwt = require("jsonwebtoken");

module.exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    const userRepository = new UserRepository();

    //get user with same username
    var [rows, fields] = await userRepository.getUserByUsername(username);

    //validate query results to only return 1 user
    if (rows.length == 0) {
        throw new ErrorHandler("User does not exist");
    } else if (rows.length > 1) {
        throw new ErrorHandler("More than one user with username exist. Check with admin");
    }

    //verify password
    var verified = await authUtils.verifyPassword(password, rows[0].password);

    //create cook options
    const expirationDate = new Date(Date.now() + process.env.COOKIE_EXPIRATION_TIME * 60 * 1000);
    const cookieOptions = {
        expire: expirationDate,
        httpOnly: true,
    };

    if (verified) {
        const jwToken = await authUtils.generateJWToken(rows[0].id);

        res.status(200).cookie("token", jwToken, cookieOptions).json({
            success: true,
            token: jwToken,
        });
    } else {
        const jwToken = "";
        res.status(401).cookie("token", jwToken, cookieOptions).json({
            success: false,
            token: "",
        });
    }
});
