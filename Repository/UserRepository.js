const connection = require("../sqlConnection/sqlConnection");
const User = require("../models/User");
const userSql = require("../sql/userSql");
const authUtils = require("../Utils/AuthUtils");
const ErrorHandler = require("../Utils/ErrorHandler");

class UserRepository {
    async createUser(user) {
        var existingUser = await this.getUserByUsername(user.username);
        if (existingUser.length > 0) {
            throw new ErrorHandler("Username already exists. Try using a different username.", 422);
        } else if (!authUtils.validatePassword(user.password)) {
            throw new ErrorHandler("Password does not pass the validation. Password should contain letters, numbers and special characters. Passwords should also be between 8 and 10 characters.", 400);
        }

        var hashedPassword = await authUtils.hashPassword(user.password);

        //add new user to ACCOUNTS table
        try {
            var userCreated = await connection.execute(userSql.createUser, [user.username, hashedPassword, user.email, user.active]);
        } catch (err) {
            throw new ErrorHandler(err.message, 400);
        }

        try {
            if (user.userGroups && user.userGroups.length !== 0) {
                this.addUsergroupMappings(user);
            }
        } catch (err) {
            //TODO: handle error
            throw new ErrorHandler(err.message, 400);
        }
        return userCreated;
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

    async updateUser(user) {
        let changePassword = true;
        if (user.username === "admin" && user.active === "inactive") {
            throw new ErrorHandler("admin user cannot be set to inactive.", 400);
        } else if (user.username === "admin" && !user.userGroups.includes("admin")) {
            throw new ErrorHandler("admin usergroup cannot be removed from admin", 400);
        }

        var existingUser = await this.getUserByUsername(user.username);

        if (existingUser.length == 0) {
            throw new ErrorHandler("User does not exist. Choose a different user to update.", 404);
        }

        if (user.password.trim().length === 0) {
            changePassword = false;
        } else {
            if (!authUtils.validatePassword(user.password)) {
                throw new ErrorHandler("Password invalid try again", 400);
            }
        }

        if (!changePassword) {
            if (existingUser.length == 0) {
                throw new ErrorHandler("User does not exist. Choose a different user to update.", 404);
            }
            //update account details
            try {
                var userUpdated = await connection.execute(userSql.updateUserExcludingPassword, [user.email, user.active, user.username]);
            } catch (err) {
                throw new ErrorHandler("failed to execute updateUserExcludingPassword", 400);
            }
        } else {
            const newPassword = await authUtils.hashPassword(user.password);
            var userUpdated = await connection.execute(userSql.updateUserIncludingPassword, [newPassword, user.email, user.active, user.username]);
        }

        try {
            var userGroupMappingsDeleted = await connection.execute(userSql.deleteUsergroupMappingsOfUser, [user.username]);
        } catch (err) {
            throw new ErrorHandler("failed to execute deleteUsergroupMappingsOfUser", 400);
        }

        if (user.userGroups.length !== 0) {
            await this.addUsergroupMappings(user);
        }

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
                if (userGroupName === null) {
                    result[username] = { username, password, email, active, userGroups: [] };
                } else {
                    result[username] = { username, password, email, active, userGroups: [userGroupName] };
                }
            } else {
                result[username].userGroups.push(userGroupName);
            }
            return result;
        }, []);

        const finalUsersData = Object.values(formattedUsers);
        return finalUsersData;
    }

    async getUserByUsername(username) {
        //for users without usergroups
        // for users with usergroups
        var users = await connection.execute(userSql.getUserByUsername, [username]);

        const formattedUser = users[0].reduce((result, user) => {
            const { username, password, email, active, userGroupName } = user;

            if (!result[username]) {
                if (userGroupName) {
                    result[username] = { username, password, email, active, userGroups: [userGroupName] };
                } else {
                    result[username] = { username, password, email, active, userGroups: [] };
                }
            } else {
                result[username].userGroups.push(userGroupName);
            }
            return result;
        }, []);

        const finalUserData = Object.values(formattedUser);
        return finalUserData;
    }

    async addUsergroupMappings(user) {
        const usernameUserGroupPairs = user.userGroups.map((userGroup) => {
            return [user.username, userGroup];
        });

        //map username to usergroups in ACCOUNTS_USERGROUPS table
        const queryWildCards = usernameUserGroupPairs.map(() => "(?, ?)").join(", ");

        var query = userSql.createUserWithGroups + queryWildCards;
        var usernameUserGroupPairsflattened = [].concat(...usernameUserGroupPairs);

        //add mappings into ACCOUNTS_USERGROUPS table
        var userGroupsMapped = await connection.execute(query, usernameUserGroupPairsflattened);
        return userGroupsMapped;
    }

    async getAllUsersAppPermitDone() {
        await connection.execute(query, usernameUserGroupPairsflattened);
    }
}

module.exports = UserRepository;
