const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'db',
    port: 3306,
    user: 'root',
    password: 'kindergarten',
    database: 'kindergarten'
});

connection.connect((err) => {
    if (err) {
        throw err;
        console.log(err);
    } else {
        console.log('Connected to MySQL Server!');

    }
});

module.exports = connection;