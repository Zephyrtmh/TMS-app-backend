const connection = require("../sqlConnection/sqlConnection");
const User = require("../models/User");
const userGroupSql = require("../sql/userGroupSql");
const authUtils = require("../Utils/AuthUtils");
const ErrorHandler = require("../Utils/ErrorHandler");

class GroupRepository {
    async getUserGroups() {
        var userGroups = await connection.execute(userGroupSql.getUserGroups);
        return userGroups;
    }

    async createUserGroup(userGroupName) {
        try {
            var userGroup = await connection.execute(userGroupSql.createUserGroup, [userGroupName]);
        } catch (err) {
            throw new ErrorHandler(err.message, 409);
        }

        return userGroup;
    }
}

module.exports = GroupRepository;
