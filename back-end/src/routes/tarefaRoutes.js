// src/routes/tarefaRoutes.js
// Define os endpoints da API de tarefas

const { Router } = require("express");
const tarefaController = require("../controllers/tarefaController");

const router = Router();

// POST   /tarefas      → criar tarefa
router.post("/", tarefaController.criar);

// GET    /tarefas      → listar tarefas
router.get("/", tarefaController.listar);

// PUT    /tarefas/:id  → atualizar tarefa (qualquer combinação de campos)
router.put("/:id", tarefaController.atualizar);

// DELETE /tarefas/:id  → remover tarefa
router.delete("/:id", tarefaController.deletar);

module.exports = router;
