const User = require("../models/User");
const connection = require("../sqlConnection/sqlConnection");
const authUtils = require("../Utils/AuthUtils");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../Utils/ErrorHandler");

async function getAllUsers(username, password, email) {
    connection.query("select * from accounts").then(([rows, fields]) => {
        return rows;
    });
}

async function checkIfUserExists(username) {
    var [rows, fields] = await connection.query(`select username from accounts where username = '${username}';`);

    if (rows.length === 0) {
        return false;
    } else {
        return true;
    }
}

module.exports = { getAllUsers };
