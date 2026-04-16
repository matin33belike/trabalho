import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import taskRoutes from "./routes/tasks.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rotas do BetterAuth (cadastro, login, logout, etc.)
app.all("/api/auth/*", toNodeHandler(auth));

// Rotas de tarefas
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
