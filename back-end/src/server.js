// src/server.js
// Ponto de entrada da aplicação — inicializa o servidor

require("dotenv").config();

const app = require("./app");
const prismaMain = require("./prisma/mainClient");
const prismaLogs = require("./prisma/logsClient");

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    // Verifica conexão com ambos os bancos antes de subir o servidor
    await prismaMain.$connect();
    console.log("[DB] Banco principal conectado com sucesso.");

    await prismaLogs.$connect();
    console.log("[DB] Banco de logs conectado com sucesso.");

    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`   Ambiente: ${process.env.NODE_ENV || "development"}\n`);
    });
  } catch (error) {
    console.error("[Server] Falha ao iniciar:", error.message);
    process.exit(1);
  }
}

// Encerramento gracioso ao receber sinal do sistema
async function encerrar(sinal) {
  console.log(`\n[Server] Sinal ${sinal} recebido. Encerrando...`);
  await prismaMain.$disconnect();
  await prismaLogs.$disconnect();
  console.log("[DB] Conexões encerradas.");
  process.exit(0);
}

process.on("SIGINT", () => encerrar("SIGINT"));
process.on("SIGTERM", () => encerrar("SIGTERM"));

iniciar();
