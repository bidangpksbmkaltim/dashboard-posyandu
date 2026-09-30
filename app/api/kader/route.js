// app/api/kader/route.js
import { NextResponse } from "next/server";
import { isValidSessionCookieHeader } from "@/lib/session";
import { getKaderData } from "@/lib/sheets";

export const revalidate = 60;

export async function GET(request) {
  if (!isValidSessionCookieHeader(request.headers.get("cookie"))) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }
  const data = await getKaderData();
  return NextResponse.json({ data, syncedAt: new Date().toISOString() });
}