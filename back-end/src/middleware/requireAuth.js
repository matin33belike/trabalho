import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export async function requireAuth(req, res, next) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ error: "Acesso negado. Por favor, faça login." });
  }

  req.user = session.user;
  req.session = session.session;

  console.log(`[AUTH] ${new Date().toISOString()} — ${req.user.email} acessou ${req.method} ${req.originalUrl}`);

  next();
}
