import { Router } from "express";
import * as TaskController from "../controllers/task.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// Todas as rotas de tarefas são protegidas
router.get("/stats", requireAuth, TaskController.stats);
router.get("/", requireAuth, TaskController.listar);
router.post("/", requireAuth, TaskController.criar);
router.put("/:id", requireAuth, TaskController.atualizar);
router.patch("/:id/status", requireAuth, TaskController.alterarStatus);
router.delete("/:id", requireAuth, TaskController.deletar);

export default router;
