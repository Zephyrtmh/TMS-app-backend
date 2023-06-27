const connection = require("../sqlConnection/sqlConnection");
const User = require("../models/User");
const userSql = require("../sql/userSql");
const authUtils = require("../Utils/AuthUtils");
const ErrorHandler = require("../Utils/ErrorHandler");

class UserRepository {
    async createUser(user) {
        var existingUser = await this.getUserByUsername(user.username);
        if (existingUser[0].length > 0) {
            throw new ErrorHandler("Username already exists. Try signing in or using a different username.", 422);
        } else if (!authUtils.validatePassword(user.password)) {
            throw new ErrorHandler("Password does not pass the validation. Password should contain letters, numbers and special characters.", 400);
        }

        var userGroupNames = user.userGroupNames;

        const usernameUserGroupPairs = userGroupNames.map((userGroup) => {
            return [user.username, userGroup];
        });

        var hashedPassword = await authUtils.hashPassword(user.password);

        try {
            //add user into ACCOUNTS table
            var userCreated = await connection.execute(userSql.createUser, [user.username, hashedPassword, user.email, user.active]);

            //map username to usergroups in ACCOUNTS_USERGROUPS table
            const queryWildCards = usernameUserGroupPairs.map(() => "(?, ?)").join(", ");

            var query = userSql.createUserWithGroups + queryWildCards;
            var usernameUserGroupPairsflattened = [].concat(...usernameUserGroupPairs);

            //add mappings into ACCOUNTS_USERGROUPS table
            var userGroupsMapped = await connection.execute(query, usernameUserGroupPairsflattened);

            var usersCreated = userCreated[0].affectedRows;
            var userGroupsMapCreated = userGroupsMapped[0].affectedRows;

            var data = {
                success: true,
                username: user.username,
                createdUser: usersCreated,
                createdMappings: userGroupsMapCreated,
            };
        } catch (err) {
            //TODO: handle error
            console.log(err);
        }
        return data;
    }

    async deleteUser(username) {
        var existingUser = await this.getUserByUsername(username);
        if (existingUser[0].length == 0) {
            throw new ErrorHandler("User does not exist. Choose a different user to delete.", 404);
        }
        var userDeleted = await connection.execute(userSql.deleteUser, [username]);
        return userDeleted;
    }

    async deactivateUser(username) {
        var existingUser = await this.getUserByUsername(username);
        if (existingUser[0].length == 0) {
            throw new ErrorHandler("User does not exist. Choose a different user to delete.", 404);
        }
        var userDeactivated = await connection.execute(userSql.deactivateUser, [username]);
        return userDeactivated;
    }

    async activateUser(username) {
        var existingUser = await this.getUserByUsername(username);
        if (existingUser[0].length == 0) {
            throw new ErrorHandler("User does not exist. Choose a different user to delete.", 404);
        }
        var userDeactivated = await connection.execute(userSql.activateUser, [username]);
        return userDeactivated;
    }

    async updateUser(user, changePassword) {
        var existingUser = await this.getUserByUsername(user.username);

        if (!changePassword) {
            if (existingUser[0].length == 0) {
                throw new ErrorHandler("User does not exist. Choose a different user to update.", 404);
            }
            var userUpdated = await connection.execute(userSql.updateUserExcludingPassword, [user.email, user.active, user.userGroupName, user.username]);
            return userUpdated;
        }

        if (existingUser[0].length == 0) {
            throw new ErrorHandler("User does not exist. Choose a different user to update.", 404);
        }
        if (!authUtils.validatePassword(user.password)) {
            throw new ErrorHandler("Password invalid try again", 400);
        }
        const newPassword = await authUtils.hashPassword(user.password);
        var userUpdated = await connection.execute(userSql.updateUserIncludingPassword, [newPassword, user.email, user.active, user.userGroupName, user.username]);
        return userUpdated;
    }

    async getAllUsers() {
        //get all users data inner joined with ACCOUNTS_USERGROUPS table
        var users = await connection.execute(userSql.getAllUsers);

        //process to group userGroupData together:
        /*
        {
            username: 'test8',
            password: 'password',
            email: 'admin1@email.com',
            active: 'active',
            userGroups: [ 'admin', 'project lead', 'project manager' ]
        }
        */
        const formattedUsers = users[0].reduce((result, user) => {
            const { username, password, email, active, userGroupName } = user;

            if (!result[username]) {
                result[username] = { username, password, email, active, userGroups: [userGroupName] };
            } else {
                result[username].userGroups.push(userGroupName);
            }
            return result;
        }, []);

        const finalUsersData = Object.values(formattedUsers);
        console.log(finalUsersData);
        return finalUsersData;
    }

    async getUserByUsername(username) {
        var users = await connection.execute(userSql.getUserByUsername, [username]);

        const formattedUser = users[0].reduce((result, user) => {
            const { username, password, email, active, userGroupName } = user;

            if (!result[username]) {
                result[username] = { username, password, email, active, userGroups: [userGroupName] };
            } else {
                result[username].userGroups.push(userGroupName);
            }
            return result;
        }, []);

        const finalUserData = Object.values(formattedUser);

        return finalUserData;
    }
}

module.exports = UserRepository;
