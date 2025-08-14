const db = require('../db');
const bcrypt = require('bcrypt');

exports.register = (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [firstName, lastName, email, hashedPassword], (err) => {
    if (err) return res.status(500).json({ msg: 'Registration failed', error: err });
    res.status(200).json({ msg: 'User registered successfully' });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ msg: 'Database error' });
    if (results.length === 0) return res.status(404).json({ msg: 'User not found' });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    res.status(200).json({ msg: 'Login successful', user: { id: user.id, firstName: user.first_name, email: user.email } });

  });
};
