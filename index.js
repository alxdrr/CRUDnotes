const express = require("express");
const app = express();
const connection = require("./database");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());

const PORT = process.env.APP_PORT || 3000;

// Create a new note
app.post("/notes", (req, res) => {
  const { title, datetime, note } = req.body;
  const query = "INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)";
  connection.query(query, [title, datetime, note], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: results.insertId });
  });
});

// Get all notes
app.get("/notes", (req, res) => {
  const query = "SELECT * FROM notes";
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
});

// Get a single note by ID
app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM notes WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json(results[0]);
  });
});

// Update a note by ID
app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, datetime, note } = req.body;
  const query =
    "UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?";
  connection.query(query, [title, datetime, note, id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note updated successfully" });
  });
});

// Delete a note by ID
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM notes WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
