import { NextResponse } from "next/server";

const rotasPrivadas = ["/dashboard", "/tasks", "/plans-admin"];

const rotasDeAuth = ["/login", "/register"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const sessionResponse = await fetch(
    "http://localhost:5500/api/auth/get-session",
    {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  );

  const session = await sessionResponse.json();
  const estaLogado = !!session?.user;

  if (!estaLogado && rotasPrivadas.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (estaLogado && rotasDeAuth.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    "/plans-admin/:path*",
    "/login",
    "/register",
  ],
};
