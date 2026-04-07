// src/controllers/tarefaController.js
// Responsável por tratar requisições HTTP e delegar ao service

const tarefaService = require("../services/tarefaService");

/**
 * POST /tarefas
 * Cria uma nova tarefa.
 */
async function criar(req, res) {
  try {
    const { titulo, descricao, dataLimite } = req.body;

    if (!titulo || typeof titulo !== "string" || titulo.trim() === "") {
      return res
        .status(400)
        .json({ erro: "O campo 'titulo' é obrigatório e não pode ser vazio." });
    }

    const tarefa = await tarefaService.criarTarefa({
      titulo: titulo.trim(),
      descricao,
      dataLimite,
    });

    return res.status(201).json(tarefa);
  } catch (error) {
    console.error("[TarefaController] Erro ao criar tarefa:", error.message);
    return res.status(500).json({ erro: "Erro interno ao criar tarefa." });
  }
}

/**
 * GET /tarefas
 * Lista todas as tarefas.
 */
async function listar(req, res) {
  try {
    const tarefas = await tarefaService.listarTarefas();
    return res.status(200).json(tarefas);
  } catch (error) {
    console.error("[TarefaController] Erro ao listar tarefas:", error.message);
    return res.status(500).json({ erro: "Erro interno ao listar tarefas." });
  }
}

/**
 * PUT /tarefas/:id
 * Atualiza uma ou mais propriedades de uma tarefa.
 */
async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { titulo, descricao, concluida, dataLimite } = req.body;

    const camposPermitidos = { titulo, descricao, concluida, dataLimite };
    const temAlteracao = Object.values(camposPermitidos).some(
      (v) => v !== undefined
    );

    if (!temAlteracao) {
      return res.status(400).json({
        erro: "Informe ao menos um campo para atualizar: titulo, descricao, concluida, dataLimite.",
      });
    }

    if (concluida !== undefined && typeof concluida !== "boolean") {
      return res
        .status(400)
        .json({ erro: "O campo 'concluida' deve ser um booleano (true/false)." });
    }

    const tarefa = await tarefaService.atualizarTarefa(id, camposPermitidos);

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada." });
    }

    return res.status(200).json(tarefa);
  } catch (error) {
    console.error("[TarefaController] Erro ao atualizar tarefa:", error.message);
    return res.status(500).json({ erro: "Erro interno ao atualizar tarefa." });
  }
}

/**
 * DELETE /tarefas/:id
 * Remove uma tarefa pelo ID.
 */
async function deletar(req, res) {
  try {
    const { id } = req.params;
    const tarefa = await tarefaService.deletarTarefa(id);

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada." });
    }

    return res.status(200).json({ mensagem: "Tarefa removida com sucesso.", tarefa });
  } catch (error) {
    console.error("[TarefaController] Erro ao deletar tarefa:", error.message);
    return res.status(500).json({ erro: "Erro interno ao deletar tarefa." });
  }
}

module.exports = { criar, listar, atualizar, deletar };
