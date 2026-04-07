// src/app.js
// Configuração central do Express

const express = require("express");
const tarefaRoutes = require("./routes/tarefaRoutes");

const app = express();

// Middleware para parse de JSON
app.use(express.json());

// Rota de health check
app.get("/", (req, res) => {
  res.json({
    status: "online",
    mensagem: "API Gerenciador de Tarefas está funcionando.",
    versao: "1.0.0",
  });
});

// Rotas da API
app.use("/tarefas", tarefaRoutes);

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ erro: `Rota '${req.path}' não encontrada.` });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error("[App] Erro não tratado:", err);
  res.status(500).json({ erro: "Erro interno inesperado no servidor." });
});

module.exports = app;
