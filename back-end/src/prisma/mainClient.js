// src/prisma/mainClient.js
// Cliente Prisma para o banco de dados principal (tarefas)

const { PrismaClient } = require("../../node_modules/.prisma/client-main");

const prismaMain = new PrismaClient({
  log: ["error", "warn"],
});

module.exports = prismaMain;
