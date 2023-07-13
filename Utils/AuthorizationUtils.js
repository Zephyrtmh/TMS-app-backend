const ErrorHandler = require("../Utils/ErrorHandler");
const UserRepository = require("../Repository/UserRepository");

module.exports.checkGroup = async (username, userGroup) => {
    try {
        const userRepository = new UserRepository();
        var user = await userRepository.getUserByUsername(username);
        var userGroupActual = user[0].userGroups;
        for (let userGroup_ of userGroupActual) {
            if (userGroup_ === userGroup) {
                return true;
            }
        }
        return false;
    } catch (err) {
        throw new ErrorHandler("Something went wrong while trying to checkGroup.", 401);
    }
};

module.exports.userIsPermitted = async (username, userGroupsPermitted) => {
    for (let groupPermitted of userGroupsPermitted) {
        var inGroup = await this.checkGroup(username, groupPermitted);
        if (inGroup) {
            return true;
        }
    }
    return false;
};
