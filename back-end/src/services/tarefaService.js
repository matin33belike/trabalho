const prismaMain = require("../prisma/mainClient");
const { registrarLog } = require("./logService");

async function criarTarefa({ titulo, descricao, dataLimite, userId }) {
  const tarefa = await prismaMain.tarefa.create({
    data: {
      titulo,
      descricao: descricao ?? null,
      dataLimite: dataLimite ? new Date(dataLimite) : null,
      userId,
    },
  });

  await registrarLog(`Tarefa criada: "${tarefa.titulo}" (ID: ${tarefa.id}) por user ${userId}`);

  return tarefa;
}

async function listarTarefas(userId) {
  return prismaMain.tarefa.findMany({
    where: { userId },
    orderBy: { dataCriacao: "desc" },
  });
}

async function atualizarTarefa(id, { titulo, descricao, concluida, dataLimite }, userId) {
  const existe = await prismaMain.tarefa.findFirst({
    where: { id, userId },
  });
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

async function deletarTarefa(id, userId) {
  const existe = await prismaMain.tarefa.findFirst({
    where: { id, userId },
  });
  if (!existe) return null;

  const tarefa = await prismaMain.tarefa.delete({ where: { id } });

  await registrarLog(`Tarefa removida: "${tarefa.titulo}" (ID: ${id}) por user ${userId}`);

  return tarefa;
}

module.exports = { criarTarefa, listarTarefas, atualizarTarefa, deletarTarefa };
