import express from "express";
import cors from "cors";
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
// import prisma from "./lib/prisma.js" error muito grande
import { prisma } from "./lib/prisma.js"; 
// SyntaxError: The requested module './prisma.js' does not provide an export named 'default'

const app = express();
app.use(cors());
app.use(express.json());

app.all("/api/auth/*", toNodeHandler(auth));

async function verificarAutenticacao(req, res, next) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
        return res.status(401).json({ error: "Acesso negado. Usuário não autenticado." });
    }
    req.user = session.user;
    next();
}

app.post("/api/tasks", verificarAutenticacao, async (req, res) => {
    const { title, description, time } = req.body;
    try {
        const novaTarefa = await prisma.task.create({
            data: {
                title,
                description,
                time: new Date(time),
                userId: req.user.id 
            }
        });
        res.status(201).json(novaTarefa);
    } catch (error) {
        res.status(400).json({ error: "Erro ao criar tarefa." });
    }
});

app.get("/api/tasks", verificarAutenticacao, async (req, res) => {
    try {
        const tarefas = await prisma.task.findMany({
            where: { userId: req.user.id },
            orderBy: { time: "asc" } 
        });
        res.json(tarefas);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar tarefas." });
    }
});

app.put("/api/tasks/:id", verificarAutenticacao, async (req, res) => {
    const { id } = req.params;
    const { title, description, time } = req.body;
    try {
        const resultado = await prisma.task.updateMany({
            where: { 
                id: id,
                userId: req.user.id 
            },
            data: {
                title,
                description,
                time: time ? new Date(time) : undefined
            }
        });
        
        if (resultado.count === 0) {
            return res.status(404).json({ error: "Tarefa não encontrada ou acesso negado." });
        }
        res.json({ message: "Tarefa atualizada com sucesso." });
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar tarefa." });
    }
});

app.delete("/api/tasks/:id", verificarAutenticacao, async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await prisma.task.deleteMany({
            where: { 
                id: id,
                userId: req.user.id 
            }
        });

        if (resultado.count === 0) {
            return res.status(404).json({ error: "Tarefa não encontrada ou acesso negado." });
        }
        res.json({ message: "Tarefa deletada com sucesso." });
    } catch (error) {
        res.status(400).json({ error: "Erro ao deletar tarefa." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Provavel mensagem nunca a ser vista, ta rodando o servidor ${PORT}`);
});