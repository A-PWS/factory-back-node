const mysql = require("mysql");
const dotenv = require("dotenv");

var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USERNAME,
    password        : process.env.DB_PASSWORD,
    database        : process.env.DB_NAME,
    multipleStatements: true
});

pool.getConnection(function (err, connection) {
    if(err) throw err;
    console.log("db connected");
})

module.exports = pool;