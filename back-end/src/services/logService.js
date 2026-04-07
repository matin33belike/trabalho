// src/services/logService.js
// Responsável por registrar logs no banco secundário

const prismaLogs = require("../prisma/logsClient");

/**
 * Registra uma entrada de log no banco de dados de logs.
 * @param {string} descricao - Descrição da ação realizada
 */
async function registrarLog(descricao) {
  try {
    await prismaLogs.log.create({
      data: { descricao },
    });
  } catch (error) {
    // Falha no log não deve interromper o fluxo principal
    console.error("[LogService] Falha ao registrar log:", error.message);
  }
}

module.exports = { registrarLog };
