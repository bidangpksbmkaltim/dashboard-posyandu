// app/api/auth/route.js
import { NextResponse } from "next/server";
import { checkCredentials, createSession, destroySession } from "@/lib/session";

export async function POST(request) {
  const { username, password } = await request.json();
  if (!checkCredentials(username, password)) {
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  }
  createSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  destroySession();
  return NextResponse.json({ ok: true });
}
