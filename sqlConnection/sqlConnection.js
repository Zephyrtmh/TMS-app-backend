const mysql = require("mysql2");

//setup mysql connection
mySqlConnection = mysql
    .createPool({
        host: "localhost",
        user: "root",
        password: "root",
        database: "tmsdb",
    })
    .promise();

module.exports = mySqlConnection;
