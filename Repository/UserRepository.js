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
        var hashedPassword = await authUtils.hashPassword(user.password);
        console.log(user);
        var userCreated = await connection.execute(userSql.createUser, [user.username, hashedPassword, user.email, user.active, user.userGroupName]);
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
        var existingUser = await this.getUserByUsername(user.username);
        if (existingUser[0].length == 0) {
            throw new ErrorHandler("User does not exist. Choose a different user to update.", 404);
        }
        if (!authUtils.validatePassword(user.password)) {
            throw new ErrorHandler("Password invalid try again", 400);
        }
        const newPassword = await authUtils.hashPassword(user.password);
        var userUpdated = await connection.execute(userSql.updateUser, [newPassword, user.email, user.active, user.userGroupName, user.username]);
        return userUpdated;
    }

    async getAllUsers() {
        var users = await connection.execute(userSql.getAllUsers);
        users = users[0];
        var usersMapped = [];
        users.forEach((user) => {
            usersMapped.push(new User(user.username, user.password, user.email, user.active, user.userGroup));
        });
        return usersMapped;
    }

    async getUserByUsername(username) {
        var users = await connection.execute(userSql.getUserByUsername, [username]);
        return users;
    }
}

module.exports = UserRepository;
