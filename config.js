require('dotenv').config(); // Load environment variables from .env file

const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Use DB_PORT if provided in the .env, otherwise default to 3306
});

// Test the connection (optional but useful for debugging)
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL');
        connection.release(); // Always release the connection back to the pool
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
    }
}

testConnection();

module.exports = pool;
