// app/api/posyandu/route.js
import { NextResponse } from "next/server";
import { isValidSessionCookieHeader } from "@/lib/session";
import { getPosyanduData } from "@/lib/sheets";

// revalidate: cache selama 60 detik di edge, biar nggak nembak sumber data
// (nanti: Google Sheets API) tiap kali ada yang buka dashboard — ini yang
// jaga supaya tetap ringan & nggak boros kuota di skala provinsi.
export const revalidate = 60;

export async function GET(request) {
  if (!isValidSessionCookieHeader(request.headers.get("cookie"))) {
    return NextResponse.json({ error: "Belum login." }, { status: 401 });
  }
  const data = await getPosyanduData();
  return NextResponse.json({ data, syncedAt: new Date().toISOString() });
}