import express from "express";
import { createTask, getTasks, updateTask, deleteTask, getReminders } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
 
const router = express.Router();

router.use(protect);

router.post("/", createTask);
router.get("/", protect, getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/reminders", protect, getReminders);

export default router;
