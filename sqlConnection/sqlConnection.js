const mysql = require("mysql2");

//setup mysql connection
const mySqlConnection2 = async () => {
    try {
        mysql
        .createPool({
            host: "localhost",
            user: "root",
            password: "root",
            database: "tmsdb",
        })
        .promise();

        return mysql;
    }
    catch(err) {
        console.log(err.message);
        try {
            await this.setUpDatabase();
        }
        catch(err) {
            console.log(err.message);
        }
        finally {
            console.log('database successfully setup');
        }
    }
}

const mySqlConnection = mysql
.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tmsdb",
})
.promise();



const setUpDatabase = async (req, res, next) => {
    console.log("Creating database...");
    // Query to create DB
    const createDB = "CREATE DATABASE IF NOT EXISTS tmsdb;";
  
    // Query to create accounts table
    const createAccounts = `
      CREATE TABLE IF NOT EXISTS accounts (
        username varchar(50) PRIMARY KEY,
        password varchar(100),
        email varchar(100),
        active varchar (20)
      );
    `;
  
    // Query to create accounts_usergroups table
    const createAccountsUserGroups = `
      CREATE TABLE IF NOT EXISTS accounts_usergroups (
        username varchar(50),
        userGroupName varchar(50),
        PRIMARY KEY (username, userGroupName)
      );
    `;
  
    // Query to create user_group table
    const createUserGroups = `
      CREATE TABLE IF NOT EXISTS user_group (
        userGroupName varchar(50) PRIMARY KEY
      );
    `;
  
    // Query to create applications table
    const createApplication = `
      CREATE TABLE IF NOT EXISTS applications (
        app_acronym VARCHAR(255),
        app_description TEXT,
        app_Rnumber VARCHAR(50),
        app_startdate DATE,
        app_enddate DATE,
        app_permit_open VARCHAR(50),
        app_permit_todo VARCHAR(50),
        app_permit_doing VARCHAR(50),
        app_permit_done VARCHAR(50),
        PRIMARY KEY(app_acronym)
      );
    `;
  
    // Execute the queries
    try {
      console.log("Creating database...");
      await mySqlConnection.query(createDB);
      console.log("Database created.");
      
      console.log("Creating tables...");
      await mySqlConnection.query(createAccounts);
      await mySqlConnection.query(createAccountsUserGroups);
      await mySqlConnection.query(createUserGroups);
      await mySqlConnection.query(createApplication);
      console.log("Tables created.");
  
      next();
    } catch (err) {
      console.log(err);
      // Handle any errors that occurred during the database setup
      // For example, you can send an error response to the client
      res.status(500).json({ error: "Failed to set up database." });
    }
  };

module.exports = mySqlConnection;
