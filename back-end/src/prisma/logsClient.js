const { PrismaClient } = require("../../node_modules/.prisma/client-logs");

const prismaLogs = new PrismaClient({
  log: ["error", "warn"],
});

module.exports = prismaLogs;
