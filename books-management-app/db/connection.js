const mysql = require('mysql');

// Create a connection pool
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '', // Update with your MySQL password
    database: 'library'
});

// Export the pool for query use
module.exports = pool;
