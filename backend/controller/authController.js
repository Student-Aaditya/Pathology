const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authController = {
  register: async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
      // Check if user exists
      const checkSql = "SELECT * FROM pathology_register WHERE email = ?";
      const [existingUsers] = await db.query(checkSql, [email]);

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }
      3
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = `
        INSERT INTO pathology_register 
        (name, email, password, phone, createAt, updatedAt)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `;

      const [result] = await db.query(sql, [name, email, hashedPassword, phone]);

      // Generate token for auto-login
      const token = jwt.sign(
        {
          id: result.insertId,
          email: email,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: result.insertId,
          name: name,
          email: email,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const sql = "SELECT * FROM pathology_register WHERE email = ?";
      const [users] = await db.query(sql, [email]);

      if (users.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const user = users[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        {
          id: user.pathology_user_id,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.pathology_user_id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login error" });
    }
  },
};

module.exports = authController;