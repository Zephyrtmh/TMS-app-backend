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

    console.log(rows);
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
            reason: "User is deactivated. Please contact your admin",
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
    res.end();
});

module.exports.verifyUser = catchAsyncErrors(async (req, res, next) => {
    /*
    body: {
        userGroupsPermited: ["admin", "project lead"] --> if empty, all users permitted (check for active and matching jwt)
    }
    */
    const jwToken = req.cookies.jwToken;
    const jwtContent = await authUtils.verifyJWToken(jwToken);
    //information stored in JWT
    const jwtIpAddress = jwtContent.ipAddress;
    const jwtUsername = jwtContent.username;
    const jwtBrowserType = jwtContent.browserType;

    //information from verfity req
    const currIpAddress = req.ip;
    const currBrowserType = req.headers["user-agent"];

    const currUsername = req.body.username;

    var noUsernameNeeded = false;

    //for when react app refresh - username is null but check the rest
    if (req.body.username === "") {
        noUsernameNeeded = true;
    }
    console.log(noUsernameNeeded);

    console.log("jwtIP: " + jwtIpAddress + "currIP: " + currIpAddress);
    console.log("JWTbrowserType: " + jwtBrowserType + " currBrowserType: " + currBrowserType);

    if (jwtIpAddress !== currIpAddress || jwtBrowserType !== currBrowserType || (currUsername !== jwtUsername && !noUsernameNeeded)) {
        console.log(noUsernameNeeded);
        console.log(jwtBrowserType === currBrowserType);
        res.status(401).json({ verified: false, reason: "JWT does not match current system." });
        return next();
    }

    const userRepository = new UserRepository();
    try {
        var user = await userRepository.getUserByUsername(jwtUsername);
        user = user[0];
    } catch (err) {
        throw new ErrorHandler("Error while getting user by username.", 400);
    }

    if (user.active !== "active") {
        res.status(401).json({ verified: false, reason: "User is deactived. Contact an admin." });
        return;
    }

    const userGroupsPermitted = req.body.userGroupsPermitted;

    console.log(userGroupsPermitted);
    if (userGroupsPermitted.length !== 0) {
        if (user.userGroups.length === 0) {
            res.status(401).json({ verified: false, reason: "Access denied." });
            return;
        } else if (!user.userGroups.some((userGroup) => userGroupsPermitted.includes(userGroup))) {
            res.status(401).json({ verified: false, reason: "Access denied." });
            return;
        }
    }

    //TODO - (1) check if user is still active, (1) check if user-group matches
    res.status(200).json({ verifed: true, user: user });
});
