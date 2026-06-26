import express from "express";
import dotenv from "dotenv";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import planRoutes from "./routes/plan.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/", (req, res) => {
  res.json({
    message: "Aplicação ToDo API rodando",
    status: "OK",
  });
});

app.all("/api/auth/*path", toNodeHandler(auth));

app.use("/api/plans", planRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});
