const { PrismaClient } = require("../../node_modules/.prisma/client-main");

const prismaMain = new PrismaClient({
  log: ["error", "warn"],
});

module.exports = prismaMain;
