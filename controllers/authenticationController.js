const User = require("../models/User");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const UserRepository = require("../Repository/UserRepository");
const ErrorHandler = require("../Utils/ErrorHandler");

const authUtils = require("../Utils/AuthUtils");
const jwt = require("jsonwebtoken");
const { userIsPermitted } = require("../Utils/AuthorizationUtils");

module.exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log("attempting to login");

    const userRepository = new UserRepository();

    //get user with same username
    var [rows, fields] = await userRepository.getUserByUsername(username);

    //check that User is active
    if (!rows) {
        //validate query results to only return 1 user
        res.status(401).json({
            success: false,
            reason: "Username or password is incorrect.",
        });
    } else if (rows.active === "inactive") {
        res.status(401).json({
            success: false,
            reason: "Username or password is incorrect.",
        });
    }

    //verify password
    var verified = await authUtils.verifyPassword(password, rows.password);

    //create cook options
    const expirationDate = new Date(Date.now() + process.env.COOKIE_EXPIRATION_TIME * 60 * 1000);
    const cookieOptions = {
        expire: expirationDate,
        httpOnly: true,
        path: "/",
        domain: "localhost",
    };

    if (verified) {
        const ipAddress = req.ip;
        const browserType = req.headers["user-agent"];
        const jwToken = await authUtils.generateJWToken(rows.username, ipAddress, browserType);
        console.log(expirationDate);
        res.status(200).cookie("jwToken", jwToken, cookieOptions).json({
            success: true,
            username: rows.username,
            userGroups: rows.userGroups,
            active: rows.active,
        });
        next();
    } else {
        const jwToken = "";
        res.status(401).json({
            success: false,
            reason: "Username or password is incorrect.",
        });
    }
});

module.exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.clearCookie("jwToken");
    res.status(200).send("Successfully logged out of the system. Thank you.");
    res.end();
});

module.exports.verifyUser = catchAsyncErrors(async (req, res, next) => {
    /*
    body: {
        userGroupsPermited: ["admin", "project lead"] --> if empty, all users permitted (check for active and matching jwt)
    }
    */
    const jwToken = req.cookies.jwToken;
    console.log(jwToken);
    try {
        var jwtContent = await authUtils.verifyJWToken(jwToken);
    } catch (err) {
        throw err;
    }

    //information stored in JWT
    const jwtIpAddress = jwtContent.ipAddress;
    const jwtUsername = jwtContent.username;
    const jwtBrowserType = jwtContent.browserType;

    //information from verfity req
    const currIpAddress = req.ip;
    const currBrowserType = req.headers["user-agent"];

    const currUsername = req.body.verification.username;
    const isEndPoint = req.body.verification.isEndPoint;
    const userGroupsPermitted = req.body.verification.userGroupsPermitted;

    var noUsernameNeeded = false;

    //for when react app refresh - username is null but check the rest
    if (req.body.verification.username === "") {
        noUsernameNeeded = true;
    }
    if (jwtIpAddress !== currIpAddress || jwtBrowserType !== currBrowserType || (currUsername !== jwtUsername && !noUsernameNeeded)) {
        throw new ErrorHandler("JWT does not match current system.", 401);
    }

    const userRepository = new UserRepository();
    try {
        var user = await userRepository.getUserByUsername(jwtUsername);
        console.log(user);
        user = user[0];
    } catch (err) {
        throw new ErrorHandler("Error while getting user by username.", 400);
    }

    if (user.active !== "active") {
        throw new ErrorHandler("User is deactived. Contact an admin.", 401);
    }

    if (userGroupsPermitted.length !== 0) {
        if (user.userGroups.length === 0) {
            throw new ErrorHandler("Access denied.", 401);
        } else {
            var isPermitted = await userIsPermitted(user.username, userGroupsPermitted);
            if (!isPermitted) {
                throw new ErrorHandler("Access denied.", 401);
            }
        }
        // else if (!user.userGroups.some((userGroup) => userGroupsPermitted.includes(userGroup))) {
        //     throw new ErrorHandler("Access denied.", 401);
        // }
    }
    //TODO - (1) check if user is still active, (1) check if user-group matches
    if (isEndPoint) {
        res.status(200).json({ verifed: true, user: user });
    } else {
        next();
    }
});
