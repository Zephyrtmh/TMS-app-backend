const ErrorHandler = require("../Utils/ErrorHandler");
const UserRepository = require("../Repository/UserRepository");

module.exports.checkGroup = async (username, userGroup) => {
    try {
        const userRepository = new UserRepository();
        console.log(username);
        var user = await userRepository.getUserByUsername(username);
        console.log(user);
        var userGroupActual = user[0].userGroup;
        if (userGroupActual === userGroup) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        throw new ErrorHandler("Something went wrong while trying to checkGroup.", 401);
    }
};
