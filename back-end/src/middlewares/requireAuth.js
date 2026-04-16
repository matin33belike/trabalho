import { auth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";

export async function requireAuth(req, res, next) {
  const session = await auth.api.getSession({
    headers: new Headers(req.headers),
  });

  if (!session) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  req.user = session.user;
  next();
}
