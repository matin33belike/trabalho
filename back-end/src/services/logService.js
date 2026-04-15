const prismaLogs = require("../prisma/logsClient");

/**
 * @param {string} descricao 
 */
async function registrarLog(descricao) {
  try {
    await prismaLogs.log.create({
      data: { descricao },
    });
  } catch (error) {
    console.error("[LogService] Falha ao registrar log:", error.message);
  }
}

module.exports = { registrarLog };
