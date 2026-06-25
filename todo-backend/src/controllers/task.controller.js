import * as TaskModel from "../models/task.model.js";

// POST /api/tasks
export async function criar(req, res) {
  const { title, description } = req.body;
  const userId = req.user.id;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "O título da tarefa é obrigatório." });
  }

  const tarefa = await TaskModel.criarTarefa(userId, {
    title: title.trim(),
    description: description?.trim() ?? null,
  });

  return res.status(201).json(tarefa);
}

// GET /api/tasks
export async function listar(req, res) {
  const userId = req.user.id;
  const { status } = req.query; // ?status=pending ou ?status=completed

  const tarefas = await TaskModel.listarTarefasPorUsuario(userId, status);
  return res.json(tarefas);
}

// GET /api/tasks/stats
export async function stats(req, res) {
  const userId = req.user.id;
  const contagem = await TaskModel.contarTarefas(userId);
  return res.json(contagem);
}

// PUT /api/tasks/:id
export async function atualizar(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "O título da tarefa é obrigatório." });
  }

  const tarefa = await TaskModel.buscarTarefaPorId(id, userId);
  if (!tarefa) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  const atualizada = await TaskModel.atualizarTarefa(id, userId, {
    title: title.trim(),
    description: description?.trim() ?? null,
  });

  return res.json(atualizada);
}

// PATCH /api/tasks/:id/status
export async function alterarStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  if (!["pending", "completed"].includes(status)) {
    return res
      .status(400)
      .json({ error: 'Status inválido. Use "pending" ou "completed".' });
  }

  const tarefa = await TaskModel.buscarTarefaPorId(id, userId);
  if (!tarefa) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  const atualizada = await TaskModel.atualizarTarefa(id, userId, {
    status,
    completedAt: status === "completed" ? new Date() : null,
  });

  return res.json(atualizada);
}

// DELETE /api/tasks/:id
export async function deletar(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const tarefa = await TaskModel.buscarTarefaPorId(id, userId);
  if (!tarefa) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  await TaskModel.deletarTarefa(id, userId);
  return res.status(204).send();
}
