const mysql = require('mysql2');

function getConnection() {
    const db = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_ROOT_PASSWORD
    });
    return (db);
}

module.exports = getConnection();