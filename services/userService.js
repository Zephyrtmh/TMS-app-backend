const connection = require("../sqlConnection/sqlConnection");
const User = require("../models/User");
const UserRepository = require("../Repository/UserRepository");

async function deleteUser(username) {
    var userRepository = new UserRepository();
    console.log(username);
    var userDeleted = await userRepository.deleteUser(username);
    var numberUsersCreated = userDeleted[0];
    return numberUsersCreated;
}

async function getAllUsers() {
    var userRepository = new UserRepository();
    var users = await userRepository.getAllUsers();
    return users;
}

module.exports = { getAllUsers, deleteUser };
