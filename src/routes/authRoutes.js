const express = require("express");
const router = express.Router();

// Hardcoded credentials for demo purposes only
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// POST /api/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ message: "Login successful" });
  }

  return res.status(401).json({ message: "Invalid username or password" });
});

module.exports = router;