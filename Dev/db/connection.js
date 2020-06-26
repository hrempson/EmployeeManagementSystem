const mysql = require("mysql");

const connection = mysql.createConnection( {
    host: "localhost",
    PORT: 3306,
    user: "root",
    password: "password",
    database: "employees_db"
});

connection.connect((err) => {
    if(err) throw err;
    console.log("Connected as "+ connection.threadId);
});


module.exports = connection;