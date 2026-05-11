const db = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const patholigistAuthController = {
  register: async (req, res) => {
    try {
      const { name, email, phone, password, confirmPassword } = req.body;
      const checkSql =
        "SELECT * FROM pathologist_register WHERE pathologist_email=?";
      const [existingUsers] = await db.query(checkSql, [email]);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }
      if (phone < 10 && phone > 10) {
        return res
          .status(400)
          .json({ message: "Phone number must be 10 digits" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const confirm_Password = await bcrypt.compare(
        confirmPassword,
        hashedPassword,
      );
      if (!confirm_Password) {
        return res.status(400).json({ message: "Password does not match" });
      }
      const sql = `
            INSERT INTO pathologist_register 
            (pathologist_name, pathologist_email, pathologist_password, phone_number, createAt, updatedAt)
            VALUES (?, ?, ?, ?, NOW(), NOW())
          `;
      const [result] = await db.query(sql, [
        name,
        email,
        hashedPassword,
        phone,
      ]);
      const token = jwt.sign(
        {
          id: result.insertId,
          email: email,
        },
        JWT_SECRET,
        { expiresIn: "1d" },
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
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ message: "Server error during registration" });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const sql =
        "SELECT * FROM pathologist_register WHERE pathologist_email=?";
      const [[user]] = await db.query(sql, [email]);
      if (!user) {
        return res.status(400).json({ message: "Enter Correct email and password" });
      }
      const isMatch = await bcrypt.compare(password, user.pathologist_password);
      if (!isMatch) {
        return res.status(400).json({ message: "Enter Correct password" });
      }
      const token = jwt.sign(
        {
          id: user.pathologist_user_id,
          email: user.pathologist_email,
        },
        JWT_SECRET,
        { expiresIn: "1d" },
      );
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.pathologist_user_id,
          name: user.pathologist_name,
          email: user.pathologist_email,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Login error" ,error:err});
    }
  },
  resetPassword:async(req,res)=>{
    try {
      const {email,password}=req.body;
      const sql="SELECT * FROM pathologist_register WHERE pathologist_email=?";
      const [[user]] = await db.query(sql, [email]);
      if (!user) {
        return res.status(400).json({ message: "Enter Correct email" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql2="UPDATE pathologist_register SET pathologist_password=? WHERE pathologist_email=?";
      await db.query(sql2, [hashedPassword, email]);
      res.json({ message: "Password reset successful" });
    } catch (err) {
      console.error("Reset password error:", err);
      res.status(500).json({ message: "Reset password error" ,error:err});
    }
  }
};
module.exports = { patholigistAuthController };
