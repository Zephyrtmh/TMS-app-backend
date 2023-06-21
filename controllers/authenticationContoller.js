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
    //check that User is active
    if (rows.length == 0) {
        //validate query results to only return 1 user
        res.status(401).json({
            success: false,
            reason: "User does not exist",
        });
    } else if (rows.length > 1) {
        res.status(401).json({
            success: false,
            reason: "More than one user with username exist. Check with admin",
        });
    } else if (rows[0].active === "inactive") {
        res.status(401).json({
            success: false,
            reason: "User is deactivated. Please contact your admin",
        });
    }

    //verify password
    var verified = await authUtils.verifyPassword(password, rows[0].password);

    //create cook options
    const expirationDate = new Date(Date.now() + process.env.COOKIE_EXPIRATION_TIME * 60 * 1000);
    const cookieOptions = {
        expire: expirationDate,
        httpOnly: true,
        path: "/",
    };

    if (verified) {
        const jwToken = await authUtils.generateJWToken(rows[0].username);

        res.status(200).cookie("jwToken", jwToken, cookieOptions).json({
            success: true,
            username: rows[0].username,
            userGroup: rows[0].userGroup,
            active: rows[0].active,
        });
    } else {
        const jwToken = "";
        res.status(401).json({
            success: false,
            reason: "Incorrect password. Please try again with a different password",
        });
    }
});

module.exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.clearCookie("jwToken");
    res.status(200).send("Successfully logged out of the system. Thank you.");
});

module.exports.verifyUser = catchAsyncErrors(async (req, res, next) => {
    const jwToken = req.cookie.jwToken;
    const username = await authUtils.verifyJWToken(jwToken);
    //TODO - (1) check if user is still active, (1) check if user-group matches
    res.status(200);
});
