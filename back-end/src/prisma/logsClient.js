// src/prisma/logsClient.js
// Cliente Prisma para o banco de dados secundário (logs)

const { PrismaClient } = require("../../node_modules/.prisma/client-logs");

const prismaLogs = new PrismaClient({
  log: ["error", "warn"],
});

module.exports = prismaLogs;
