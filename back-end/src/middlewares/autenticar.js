const auth = require("../lib/auth");

async function autenticar(req, res, next) {
  try {
    const sessao = await auth.api.getSession({
      headers: req.headers,
    });

    if (!sessao || !sessao.user) {
      return res.status(401).json({
        erro: "Não autorizado. Faça login para continuar.",
      });
    }

    req.usuario = sessao.user;
    req.sessao = sessao.session;

    next();
  } catch (error) {
    console.error("[Auth Middleware] Erro ao verificar sessão:", error.message);
    return res.status(401).json({
      erro: "Sessão inválida ou expirada.",
    });
  }
}

module.exports = autenticar;
