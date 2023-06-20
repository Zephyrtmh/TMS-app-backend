const connection = require("../sqlConnection/sqlConnection");
const User = require("../models/User");
const UserRepository = require("../Repository/UserRepository");

async function createUser(user) {
    var userRepository = new UserRepository();
    var userCreated = await userRepository.createUser(user);
    var numberUsersCreated = userCreated[0];
    console.log(numberUsersCreated);
    return numberUsersCreated;
}

async function deleteUser(username) {
    var userRepository = new UserRepository();
    console.log(username);
    var userDeleted = await userRepository.deleteUser(username);
    var numberUsersCreated = userDeleted[0];
    return numberUsersCreated;
}

async function getUserById(userId) {
    var userRepository = new UserRepository();
    var user = await userRepository.getUserById(userId);
    return user;
}

async function getAllUsers() {
    var userRepository = new UserRepository();
    var users = await userRepository.getAllUsers();
    return users;
}

module.exports = { createUser, getUserById, getAllUsers, deleteUser };
