const tarefaService = require("../services/tarefaService");

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
      userId: req.usuario.id
    });

    return res.status(201).json(tarefa);
  } catch (error) {
    console.error("[TarefaController] Erro ao criar tarefa:", error.message);
    return res.status(500).json({ erro: "Erro interno ao criar tarefa." });
  }
}

async function listar(req, res) {
  try {
    const tarefas = await tarefaService.listarTarefas(req.usuario.id);
    return res.status(200).json(tarefas);
  } catch (error) {
    console.error("[TarefaController] Erro ao listar tarefas:", error.message);
    return res.status(500).json({ erro: "Erro interno ao listar tarefas." });
  }
}

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

    const tarefa = await tarefaService.atualizarTarefa(
      id,
      camposPermitidos,
      req.usuario.id
    );

    if (tarefa === null) {
      return res
        .status(404)
        .json({ erro: "Tarefa não encontrada ou sem permissão." });
    }

    return res.status(200).json(tarefa);
  } catch (error) {
    console.error("[TarefaController] Erro ao atualizar tarefa:", error.message);
    return res.status(500).json({ erro: "Erro interno ao atualizar tarefa." });
  }
}

async function deletar(req, res) {
  try {
    const { id } = req.params;
    const tarefa = await tarefaService.deletarTarefa(id, req.usuario.id);

    if (tarefa === null) {
      return res
        .status(404)
        .json({ erro: "Tarefa não encontrada ou sem permissão." });
    }

    return res
      .status(200)
      .json({ mensagem: "Tarefa removida com sucesso.", tarefa });
  } catch (error) {
    console.error("[TarefaController] Erro ao deletar tarefa:", error.message);
    return res.status(500).json({ erro: "Erro interno ao deletar tarefa." });
  }
}

module.exports = { criar, listar, atualizar, deletar };
