import { NextResponse } from "next/server";

// The password lives only in the environment (ADMIN_PASSWORD): locally in
// .env.local, in production in Vercel → Project Settings → Environment
// Variables. There is deliberately no fallback in code: the repository is
// public, and without the variable nobody can log in.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
  let password: unknown;
  try {
    const body = await request.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (ADMIN_PASSWORD && typeof password === "string" && password === ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
