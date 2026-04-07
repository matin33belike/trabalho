// src/services/tarefaService.js
// Contém toda a lógica de negócio relacionada às tarefas

const prismaMain = require("../prisma/mainClient");
const { registrarLog } = require("./logService");

/**
 * Cria uma nova tarefa no banco principal e registra log.
 * @param {object} dados - Dados da tarefa (titulo, descricao, dataLimite)
 * @returns {Promise<object>} Tarefa criada
 */
async function criarTarefa({ titulo, descricao, dataLimite }) {
  const tarefa = await prismaMain.tarefa.create({
    data: {
      titulo,
      descricao: descricao ?? null,
      dataLimite: dataLimite ? new Date(dataLimite) : null,
    },
  });

  await registrarLog(`Tarefa criada: "${tarefa.titulo}" (ID: ${tarefa.id})`);

  return tarefa;
}

/**
 * Retorna todas as tarefas cadastradas.
 * @returns {Promise<object[]>} Lista de tarefas
 */
async function listarTarefas() {
  return prismaMain.tarefa.findMany({
    orderBy: { dataCriacao: "desc" },
  });
}

/**
 * Atualiza os campos fornecidos de uma tarefa existente.
 * @param {string} id - UUID da tarefa
 * @param {object} dados - Campos a atualizar
 * @returns {Promise<object>} Tarefa atualizada
 */
async function atualizarTarefa(id, { titulo, descricao, concluida, dataLimite }) {
  // Verifica se a tarefa existe antes de tentar atualizar
  const existe = await prismaMain.tarefa.findUnique({ where: { id } });
  if (!existe) return null;

  const dadosAtualizados = {};
  if (titulo !== undefined) dadosAtualizados.titulo = titulo;
  if (descricao !== undefined) dadosAtualizados.descricao = descricao;
  if (concluida !== undefined) dadosAtualizados.concluida = concluida;
  if (dataLimite !== undefined) {
    dadosAtualizados.dataLimite = dataLimite ? new Date(dataLimite) : null;
  }

  const tarefa = await prismaMain.tarefa.update({
    where: { id },
    data: dadosAtualizados,
  });

  const acoes = [];
  if (concluida === true) acoes.push("marcada como concluída");
  if (concluida === false) acoes.push("reaberta");
  if (titulo) acoes.push("título alterado");

  const descricaoLog =
    acoes.length > 0
      ? `Tarefa "${tarefa.titulo}" (ID: ${id}): ${acoes.join(", ")}`
      : `Tarefa "${tarefa.titulo}" (ID: ${id}) atualizada`;

  await registrarLog(descricaoLog);

  return tarefa;
}

/**
 * Remove uma tarefa pelo ID.
 * @param {string} id - UUID da tarefa
 * @returns {Promise<object|null>} Tarefa removida ou null se não encontrada
 */
async function deletarTarefa(id) {
  const existe = await prismaMain.tarefa.findUnique({ where: { id } });
  if (!existe) return null;

  const tarefa = await prismaMain.tarefa.delete({ where: { id } });

  await registrarLog(`Tarefa removida: "${tarefa.titulo}" (ID: ${id})`);

  return tarefa;
}

module.exports = { criarTarefa, listarTarefas, atualizarTarefa, deletarTarefa };
