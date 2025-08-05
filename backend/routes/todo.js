import express from "express";
import prisma from "../db/index.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// ✅ GET - Get all todos for the logged-in user
router.get("/", async (req, res) => {
  try {
    const todos = await prisma.todos.findMany({
      where: { userId: req.user.sub },
      orderBy: { id: "desc" },
    });
    res.status(200).json({ success: true, todos });
  } catch (error) {
    console.error("GET /todos error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch todos" });
  }
});

// ✅ POST - Create a new todo
router.post("/", async (req, res) => {
  const { title, description } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const newTodo = await prisma.todos.create({
      data: {
        title,
        description,
        completed: false,
        userId: req.user.sub,
      },
    });

    res.status(201).json({ success: true, todo: newTodo });
  } catch (e) {
    console.error("POST /todos error:", e);
    res.status(500).json({ success: false, message: "Failed to create todo" });
  }
});

// ✅ PUT - Toggle todo completion status
router.put("/:todoId/completed", async (req, res) => {
  const todoId = Number(req.params.todoId);
  const userId = req.user.sub;
  const { completed } = req.body;

  try {
    // Validate body
    if (typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid 'completed' value (must be true or false)",
      });
    }

    const todo = await prisma.todos.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    if (todo.userId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this todo" });
    }

    const updatedTodo = await prisma.todos.update({
      where: { id: todoId },
      data: { completed },
    });

    res.status(200).json({ success: true, todo: updatedTodo });
  } catch (e) {
    console.error("PUT /:todoId/completed error:", e);
    res.status(500).json({ success: false, message: "Failed to update todo" });
  }
});


// ✅ DELETE - Only delete if the todo is completed
router.delete("/:todoId", async (req, res) => {
  const todoId = Number(req.params.todoId);
  const userId = req.user.sub;

  try {
    const todo = await prisma.todos.findUnique({ where: { id: todoId } });

    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    if (todo.userId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this todo" });
    }

    if (!todo.completed) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete todo unless it is marked as completed.",
      });
    }

    await prisma.todos.delete({ where: { id: todoId } });

    res.status(200).json({ success: true, todo: todoId });
  } catch (e) {
    console.error("DELETE /:todoId error:", e);
    res.status(500).json({ success: false, message: "Failed to delete todo" });
  }
});

export default router;
