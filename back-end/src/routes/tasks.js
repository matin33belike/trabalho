import express from "express";
import cors from "cors";
import { auth } from "./lib/auth.js"
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import listsRouter from "./routes/lists.js";
import tasksRouter from "./routes/tasks.js";
import categoriesRouter from "./routes/categories.js";
import { requireAuth } from "./middleware/requireAuth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5501;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.all("/api/auth/*path", toNodeHandler(auth));

app.use(express.json());

app.get("/api/me", requireAuth, (req, res) => {
  res.json({
    message: "Bem-vindo ao seu perfil!",
    user: req.user,
  });
});

app.use("/api/lists", listsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/categories", categoriesRouter);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({
    message: "Ta rodando!",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      me: "/api/me",
      auth: "/api/auth",
      lists: "/api/lists",
      tasks: "/api/tasks",
      categories: "/api/categories",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});
