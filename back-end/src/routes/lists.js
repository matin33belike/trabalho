import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const lists = await prisma.list.findMany({
    where: { userId: req.user.id },
    include: { tasks: true },
  });
  res.json(lists);
});

router.get("/:id", requireAuth, async (req, res) => {
  const list = await prisma.list.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { tasks: true },
  });

  if (!list) return res.status(404).json({ error: "Lista não encontrada." });
  res.json(list);
});

router.post("/", requireAuth, async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "O campo 'name' é obrigatório." });

  const list = await prisma.list.create({
    data: { name, userId: req.user.id },
  });

  res.status(201).json(list);
});

router.put("/:id", requireAuth, async (req, res) => {
  const { name } = req.body;

  const existing = await prisma.list.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!existing) return res.status(404).json({ error: "Lista não encontrada." });

  const list = await prisma.list.update({
    where: { id: req.params.id },
    data: { name },
  });

  res.json(list);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const existing = await prisma.list.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!existing) return res.status(404).json({ error: "Lista não encontrada." });

  await prisma.list.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
