const mysql = require("mysql2");

//setup mysql connection
const mySqlConnection = mysql
    .createPool({
        host: "localhost",
        user: "root",
        password: "root",
        database: "tmsdb",
    })
    .promise();

const setUpDatabase = async () => {
    //query to create DB
    const createDB = "CREATE DATABASE IF NOT EXISTS tmsdb;";

    //query to create accounts table
    const createAccounts = 
    `CREATE TABLE accounts (
        username varchar(50) PRIMARY KEY,
        password varchar(100),
        email varchar(100),
        active varchar (20)
    );`;

    //query to create accounts_usergroups table
    const createAccountsUserGroups = 
    `CREATE TABLE accounts_usergroups (
        username varchar(50),
        userGroupName varchar(50),
        PRIMARY KEY (username, userGroupName)
    );`;

    //query to create accounts_usergroups table
    const createUserGroups = 
    `CREATE TABLE user_group (
        userGroupName varchar(50) PRIMARY KEY
    );`;

    await mySqlConnection.query(createDB);
    await mySqlConnection.query(createAccounts);
    await mySqlConnection.query(createAccountsUserGroups);
    await mySqlConnection.query(createUserGroups);
    
    return;
}

module.exports = mySqlConnection;
