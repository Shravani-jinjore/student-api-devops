const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/students -> return all students
router.get("/", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// GET /api/students/:id -> return one student
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM students WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(results[0]);
  });
});

// POST /api/students -> create a new student
router.post("/", (req, res) => {
  const { name, email, branch, year } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const sql = "INSERT INTO students (name, email, branch, year) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, branch, year], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      branch,
      year,
    });
  });
});

// PUT /api/students/:id -> update an existing student
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, branch, year } = req.body;

  const sql = "UPDATE students SET name = ?, email = ?, branch = ?, year = ? WHERE id = ?";
  db.query(sql, [name, email, branch, year, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ id, name, email, branch, year });
  });
});

// DELETE /api/students/:id -> delete a student
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM students WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  });
});

module.exports = router;