const express = require("express");
const cors = require("cors");
const { toNodeHandler } = require("better-auth/node");
const auth = require("./lib/auth");
const tarefaRoutes = require("./routes/tarefaRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // necessário para cookies de sessão
  })
);

app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    status: "online",
    mensagem: "API Gerenciador de Tarefas está funcionando.",
    versao: "2.0.0",
    auth: "Better Auth",
  });
});
app.use("/tarefas", tarefaRoutes);
app.use((req, res) => {
  res.status(404).json({ erro: `Rota '${req.path}' não encontrada.` });
});
app.use((err, req, res, next) => {
  console.error("[App] Erro não tratado:", err);
  res.status(500).json({ erro: "Erro interno inesperado no servidor." });
});

module.exports = app;
