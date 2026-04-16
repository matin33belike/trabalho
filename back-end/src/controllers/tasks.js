import { prisma } from "../lib/auth.js";

export async function listTasks(req, res) {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(tasks);
}

export async function createTask(req, res) {
  const { title, dueDate } = req.body;

  if (!title) return res.status(400).json({ error: "Título obrigatório" });

  const task = await prisma.task.create({
    data: {
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.user.id,
    },
  });
  res.status(201).json(task);
}

export async function updateTask(req, res) {
  const { id } = req.params;
  const { title, done, dueDate } = req.body;

  const task = await prisma.task.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

  const updated = await prisma.task.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(done !== undefined && { done }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
    },
  });
  res.json(updated);
}

export async function deleteTask(req, res) {
  const { id } = req.params;

  const task = await prisma.task.findFirst({
    where: { id, userId: req.user.id },
  });

  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });

  await prisma.task.delete({ where: { id } });
  res.status(204).send();
}
