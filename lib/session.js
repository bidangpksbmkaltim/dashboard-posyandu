import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "posyandu_session";
// 30 hari — biar Bu Vio nggak perlu login ulang tiap hari/minggu. Ini pilihan
// "mudah dulu" karena datanya bukan data finansial; longgarkan/persempit di
// sini kalau nanti berubah pikiran.
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function sha256(text) {
  return createHash("sha256").update(text).digest();
}

// Tanda tangan digital buat isi cookie sesi — pakai SESSION_SECRET yang cuma
// server yang tau. Tanpa ini, orang bisa bikin cookie "posyandu_session=valid"
// manual dari DevTools browser dan langsung masuk tanpa login sama sekali.
function sign(value) {
  return createHmac("sha256", process.env.SESSION_SECRET || "").update(value).digest("hex");
}

function safeEqualHex(a, b) {
  const bufA = Buffer.from(a || "", "hex");
  const bufB = Buffer.from(b || "", "hex");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// Password TIDAK disimpan polos: DASHBOARD_PASSWORD_HASH di .env.local berisi
// SHA-256 hash-nya (bukan teksnya), dibandingkan pakai timingSafeEqual biar
// nggak bisa ditebak lewat selisih waktu respons (timing attack).
// Cara bikin hash: node -e "console.log(require('crypto').createHash('sha256').update('password_asli').digest('hex'))"
export function checkCredentials(username, password) {
  if (username !== process.env.DASHBOARD_USERNAME) return false;
  const expected = Buffer.from(process.env.DASHBOARD_PASSWORD_HASH || "", "hex");
  const actual = sha256(password);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

export function createSession() {
  const signedValue = `valid.${sign("valid")}`;
  cookies().set(COOKIE_NAME, signedValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export function destroySession() {
  cookies().delete(COOKIE_NAME);
}

function isValidSessionValue(raw) {
  if (!raw) return false;
  const [payload, signature] = raw.split(".");
  if (payload !== "valid" || !signature) return false;
  return safeEqualHex(sign("valid"), signature);
}

// Dipakai di Server Component (mis. app/page.js) — jalan di Node.js runtime,
// jadi bebas pakai modul crypto Node seperti di atas.
export function isLoggedIn() {
  return isValidSessionValue(cookies().get(COOKIE_NAME)?.value);
}

// Versi buat dipanggil dari luar Server Component / cookies() Next, misalnya
// dari API route yang menerima cookie header manual. Dipakai app/api/*/route.js
// buat mastiin data cuma dikirim ke sesi yang beneran valid, bukan cuma
// mengandalkan middleware (middleware jalan di Edge runtime yang nggak selalu
// bisa diandalkan sebagai satu-satunya lapis keamanan).
export function isValidSessionCookieHeader(cookieHeader) {
  if (!cookieHeader) return false;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return isValidSessionValue(match ? decodeURIComponent(match[1]) : null);
}