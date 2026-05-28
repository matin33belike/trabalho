import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

router.get("/:id", requireAuth, async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id },
    include: { tasks: true },
  });

  if (!category) return res.status(404).json({ error: "Categoria não encontrada." });
  res.json(category);
});

router.post("/", requireAuth, async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "O campo 'name' é obrigatório." });

  const category = await prisma.category.create({ data: { name } });
  res.status(201).json(category);
});

router.put("/:id", requireAuth, async (req, res) => {
  const { name } = req.body;

  const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Categoria não encontrada." });

  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: { name },
  });

  res.json(category);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Categoria não encontrada." });

  await prisma.category.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
