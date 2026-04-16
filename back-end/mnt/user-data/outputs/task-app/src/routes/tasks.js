import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { listTasks, createTask, updateTask, deleteTask } from "../controllers/tasks.js";

const router = Router();

router.use(requireAuth);

router.get("/", listTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
