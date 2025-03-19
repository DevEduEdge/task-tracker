const Task = require("./models/taskModel");
const express = require("express");
const db = require("./config/db"); // Import database connection
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors()); // Allow CORS for all origins (restrict later if needed)

// ✅ Test API endpoint
app.get("/", (req, res) => {
  res.send("Task Tracker API is running...");
});

// ✅ Get all tasks
app.get("/api/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      console.error("❌ Error fetching tasks:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// ✅ Get a single task by ID
app.get("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  db.query("SELECT * FROM tasks WHERE id = ?", [taskId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching task:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.json(results[0]);
    }
  });
});

// ✅ Add a new task (POST)
app.post("/api/tasks", (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  // ✅ Ensure description is not NULL
  const query =
    "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)";
  const values = [title, description ?? "", status || "pending"];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting task:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res
      .status(201)
      .json({ message: "Task added successfully", taskId: result.insertId });
  });
});

app.put("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const newStatus = req.body.status;

  if (!newStatus) {
    return res.status(400).json({ error: "Status is required" });
  }

  const query = "UPDATE tasks SET status = ? WHERE id = ?";
  db.query(query, [newStatus, taskId], (err, result) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task updated successfully" });
  });
});


// ✅ Start server on PORT from .env (default 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
