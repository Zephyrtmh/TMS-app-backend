const User = require("../models/User");
const userGroupSql = require("../sql/userGroupSql");
const authUtils = require("../Utils/AuthUtils");
const ErrorHandler = require("../Utils/ErrorHandler");
const connection = require("../sqlConnection/sqlConnection");

class GroupRepository {
    async getUserGroups() {
        var userGroups = await connection.execute(userGroupSql.getUserGroups);
        return userGroups;
    }

    async createUserGroup(userGroupName) {
        if (userGroupName) {
            if (userGroupName.trim() === "") {
                throw new ErrorHandler("User group name cannot empty spaces", 400);
            }
            try {
                var userGroup = await connection.execute(userGroupSql.createUserGroup, [userGroupName]);
            } catch (err) {
                console.log(err.message);
                throw new ErrorHandler(err.message, 409);
            }
            return userGroup;
        } else {
            throw new ErrorHandler("User group name cannot be blank or spaces", 400);
        }
    }
}

module.exports = GroupRepository;
