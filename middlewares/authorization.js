const catchAsyncErrors = require("./catchAsyncErrors");
const jsonwebtoken = require("jsonwebtoken");
const ErrorHandler = require("../Utils/ErrorHandler");
const { verifyJWToken } = require("../Utils/AuthUtils");
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

// module.exports.authorizeForUserGroups = catchAsyncErrors(async (req, res, next, authorizedUserGroups) => {
//     var userGroup = req.body.userGroup;
//     var verifyUserGroup = await checkGroup(req.body.username, req.body.userGroup);
//     if (!verifyUserGroup) {
//         return next(new ErrorHandler("User Group provided does not match database.", 401));
//     }
//     if (!authorizedUserGroups.includes(userGroup)) {
//         return next(new ErrorHandler("User not authorized to access this route.", 401));
//     } else {
//         next();
//     }
// });
