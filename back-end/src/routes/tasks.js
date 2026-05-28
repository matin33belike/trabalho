import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const { listId } = req.query;

  const where = { list: { userId: req.user.id } };
  if (listId) where.listId = listId;

  const tasks = await prisma.task.findMany({
    where,
    include: { category: true },
  });

  res.json(tasks);
});

router.get("/:id", requireAuth, async (req, res) => {
  const task = await prisma.task.findFirst({
    where: { id: req.params.id, list: { userId: req.user.id } },
    include: { category: true },
  });

  if (!task) return res.status(404).json({ error: "Tarefa não encontrada." });
  res.json(task);
});

router.post("/", requireAuth, async (req, res) => {
  const { listId, title, description, dueDate, priority, categoryId } = req.body;

  if (!listId || !title) {
    return res.status(400).json({ error: "Os campos 'listId' e 'title' são obrigatórios." });
  }

  const list = await prisma.list.findFirst({
    where: { id: listId, userId: req.user.id },
  });

  if (!list) return res.status(404).json({ error: "Lista não encontrada." });

  const task = await prisma.task.create({
    data: {
      listId,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority ?? 1,
      categoryId: categoryId ?? null,
    },
    include: { category: true },
  });

  res.status(201).json(task);
});

router.put("/:id", requireAuth, async (req, res) => {
  const { title, description, dueDate, priority, completed, categoryId } = req.body;

  const existing = await prisma.task.findFirst({
    where: { id: req.params.id, list: { userId: req.user.id } },
  });

  if (!existing) return res.status(404).json({ error: "Tarefa não encontrada." });

  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
      completed,
      categoryId,
    },
    include: { category: true },
  });

  res.json(task);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const existing = await prisma.task.findFirst({
    where: { id: req.params.id, list: { userId: req.user.id } },
  });

  if (!existing) return res.status(404).json({ error: "Tarefa não encontrada." });

  await prisma.task.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
