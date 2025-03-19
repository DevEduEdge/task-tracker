const db = require("../config/db");

exports.getTasks = async (req, res) => {
  try {
    const [tasks] = await db.query("SELECT * FROM tasks");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const query =
      "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)";
    const values = [title, description ?? "", status || "pending"];

    await db.query(query, values);
    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// exports.updateTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, status } = req.body;

//     // Ensure ID is a valid number
//     if (!id || isNaN(id)) {
//       return res.status(400).json({ error: "Invalid task ID" });
//     }

//     // Ensure at least one field is provided
//     if (!title && !description && !status) {
//       return res
//         .status(400)
//         .json({ error: "At least one field is required for update" });
//     }

//     // Update only provided fields
//     const query = `
//             UPDATE tasks
//             SET title = COALESCE(?, title),
//                 description = COALESCE(?, description),
//                 status = COALESCE(?, status)
//             WHERE id = ?`;

//     const [result] = await db.query(query, [title, description, status, id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "Task not found" });
//     }

//     res.json({ message: "Task updated successfully" });
//   } catch (error) {
//     console.error("Error updating task:", error);
//     res.status(500).json({ error: "Database error" });
//   }
// };

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    console.log("Received update request for ID:", id);
    console.log("Request body:", req.body);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    if (!title && !description && !status) {
      return res
        .status(400)
        .json({ error: "At least one field is required for update" });
    }

    const query = `
            UPDATE tasks 
            SET title = COALESCE(?, title), 
                description = COALESCE(?, description), 
                status = COALESCE(?, status) 
            WHERE id = ?`;

    const [result] = await db.query(query, [title, description, status, id]);

    console.log("Update result:", result);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Task not found or no changes made" });
    }

    res.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Database error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM tasks WHERE id=?", [id]);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
