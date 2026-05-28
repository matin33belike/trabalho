import express from "express";
import { auth } from "./lib/auth.js"
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import listsRouter from "./routes/lists.js";
import tasksRouter from "./routes/tasks.js";
import categoriesRouter from "./routes/categories.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5501;

app.use(express.json());

app.all("/api/auth/*path", toNodeHandler(auth));

app.use("/api/lists", listsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/categories", categoriesRouter);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({
    message: "MinURL API rodando!",
    version: "1.0.3",
    endpoints: {
      health: "/health",
      docs: "/api/docs",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});
