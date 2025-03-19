require("dotenv").config(); // Add this line at the top
const mysql = require("mysql2");

// Create a connection to the database
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Admin",
  database: process.env.DB_NAME || "task_tracker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Check the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
    connection.release();
  }
});

module.exports = db;
