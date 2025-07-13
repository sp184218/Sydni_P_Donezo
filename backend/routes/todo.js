import express from "express";
import prisma from "../db/index.js";

const router = express.Router();

// ✅ GET - Get all todos
router.get('/', async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.status(200).json({
    success: true,
    todos,
  });
});

// ✅ POST - Create a new todo
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newTodo = await prisma.todo.create({
      data: {
        name,
        description,
        completed: false,
        userId: req.user.sub,
      },
    });

    if (newTodo) {
      res.status(201).json({
        success: true,
        todo: newTodo.id,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to create new todo",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
});

// ✅ PUT - Mark todo as completed
router.put("/:todoId/completed", async (req, res) => {
  const todoId = Number(req.params.todoId);
  console.log("Updating todo ID:", todoId); // for debugging

  try {
    const todo = await prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        completed: true,
      },
    });

    res.status(200).json({
      success: true,
      todo: todo.id,
    });
  } catch (e) {
    console.error("PUT error:", e); // for debugging
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
});

// ✅ DELETE - Only delete if the todo is completed
router.delete("/:todoId", async (req, res) => {
  const todoId = Number(req.params.todoId);

  try {
    // Step 1: Find the todo
    const todo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    // Step 2: Handle if not found
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found.",
      });
    }

    // Step 3: Only allow delete if completed is true
    if (!todo.completed) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete todo unless it is marked as completed.",
      });
    }

    // Step 4: Delete it
    await prisma.todo.delete({
      where: { id: todoId },
    });

    res.status(200).json({
      success: true,
      todo: todoId,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
});

export default router;

