const ErrorHandler = require("../Utils/ErrorHandler");
const UserRepository = require("../Repository/UserRepository");

module.exports.checkGroup = async (username, userGroup) => {
    try {
        const userRepository = new UserRepository();
        var user = await userRepository.getUserByUsername(username);
        var userGroupActual = user[0].userGroups;
        console.log(userGroupActual);
        for (let userGroup_ of userGroupActual) {
            if (userGroup_ === userGroup) {
                console.log("something" + userGroup_ + userGroup);
                return true;
            }
        }
        return false;
    } catch (err) {
        throw new ErrorHandler("Something went wrong while trying to checkGroup.", 401);
    }
};

module.exports.userIsPermitted = async (username, userGroupsPermitted) => {
    console.log(userGroupsPermitted);
    for (let groupPermitted of userGroupsPermitted) {
        var inGroup = await this.checkGroup(username, groupPermitted);
        console.log;
        if (inGroup) {
            console.log("returned true");
            return true;
        }
    }
    return false;
};
