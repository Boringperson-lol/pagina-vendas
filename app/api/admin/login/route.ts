import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from "@/lib/session";

function credentialsMatch(received: string, expected: string) {
  return received.length === expected.length && received === expected;
}

export async function POST(request: Request) {
  const { username, password } = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };

  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  if (!adminUser || !adminPass) {
    return NextResponse.json({ error: "Credenciais ADMIN_USER e ADMIN_PASS nao configuradas." }, { status: 500 });
  }

  const isValid =
    typeof username === "string" &&
    typeof password === "string" &&
    credentialsMatch(username, adminUser) &&
    credentialsMatch(password, adminPass);

  if (!isValid) {
    return NextResponse.json({ error: "Usuario ou senha invalidos." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: await createAdminSessionToken(username),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}
