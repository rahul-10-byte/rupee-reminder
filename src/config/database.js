const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: 'root',
  password: '12345678',
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('MySQL connected');
});

module.exports = db;
