import { prisma } from "../lib/prisma.js";

export async function criarTarefa(userId, { title, description }) {
  return prisma.task.create({
    data: { userId, title, description },
  });
}

export async function listarTarefasPorUsuario(userId, status) {
  return prisma.task.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function buscarTarefaPorId(id, userId) {
  return prisma.task.findFirst({
    where: { id, userId },
  });
}

export async function atualizarTarefa(id, userId, data) {
  return prisma.task.update({
    where: { id, userId },
    data,
  });
}

export async function deletarTarefa(id, userId) {
  return prisma.task.delete({
    where: { id, userId },
  });
}

export async function contarTarefas(userId) {
  const [total, completed] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: "completed" } }),
  ]);
  return { total, completed, pending: total - completed };
}
