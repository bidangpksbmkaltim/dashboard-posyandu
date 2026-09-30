// app/login/page.js

import LoginForm from "@/components/auth/LoginForm";
import { KawungPattern, TumpalBorder } from "@/components/auth/BatikPattern";
import { Building2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#FBF6EC]">
      {/* Panel kiri — identitas & motif batik */}
      <div className="relative hidden w-[46%] overflow-hidden bg-gradient-to-b from-[#1B1033] via-[#211340] to-[#150C29] lg:flex lg:flex-col lg:justify-between">
        <KawungPattern
          className="pointer-events-none absolute inset-0 h-full w-full"
          opacity={0.16}
        />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#CBA135]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-24 h-64 w-64 rounded-full bg-[#9C4A2B]/25 blur-3xl" />

        <div className="relative z-10 flex flex-1 flex-col justify-center px-14 py-16">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#CBA135]/40 bg-[#CBA135]/10">
            <Building2 className="h-7 w-7 text-[#E8C766]" strokeWidth={1.75} />
          </div>
          <h1 className="font-display text-4xl leading-tight text-[#FBF6EC]">
            Monitoring Posyandu
          </h1>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#CBB8E0]">
            Satu ruang kerja untuk memantau enam bidang Standar Pelayanan
            Minimal di seluruh Kalimantan Timur.
          </p>
          <div className="mt-10 h-px w-16 bg-gradient-to-r from-[#CBA135] to-transparent" />
          <p className="mt-6 text-xs tracking-wide text-[#8577A8]">
            Dinas Pemberdayaan Masyarakat dan Pemerintahan Desa Provinsi Kalimantan Timur
          </p>
        </div>

        <TumpalBorder className="relative z-10 h-6 w-full" count={16} color="#CBA135" />
      </div>

      {/* Panel kanan — form login */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <LoginForm />
      </div>
    </div>
  );
}