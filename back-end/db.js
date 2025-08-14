const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // default XAMPP user
  password: '',       // default XAMPP password is empty
  database: 'greenshop' // change this if your DB name is different
});

conn.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

module.exports = conn;
