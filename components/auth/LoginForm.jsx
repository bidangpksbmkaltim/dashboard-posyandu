// components/auth/LoginForm.jsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { KawungPattern, TumpalBorder } from "./BatikPattern";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Username atau kata sandi salah.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } catch {
      setError("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const labelBase =
    "pointer-events-none absolute left-1 top-0 text-xs text-[#B5860F] transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#A99BC2] peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#B5860F]";
  const inputBase =
    "peer w-full border-b-2 border-[#E7DCC2] bg-transparent px-1 pb-2.5 pt-5 text-sm text-[#241832] outline-none transition-colors focus:border-[#CBA135]";

  return (
    <>
      <div
        className={`login-card-in relative w-full max-w-sm overflow-hidden rounded-[28px] border border-[#E7DCC2] bg-[#FFFDF8] p-8 shadow-[0_30px_80px_-20px_rgba(27,16,51,0.35)] sm:p-10 ${
          shake ? "shake" : ""
        }`}
      >
        <KawungPattern
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40"
          color="#9C4A2B"
          opacity={0.08}
        />

        <div className="relative mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1B1033]">
            <Lock className="h-5 w-5 text-[#E8C766]" strokeWidth={1.75} />
          </div>
          <h2 className="font-display text-2xl text-[#241832]">
            Selamat datang kembali
          </h2>
          <p className="mt-2 text-sm text-[#8B7F9C]">
            Masuk untuk melanjutkan pemantauan posyandu Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-6">
          <div className="relative">
            <input
              id="username"
              type="text"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputBase}
            />
            <label htmlFor="username" className={labelBase}>
              Username
            </label>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputBase} login-password-input`}
            />
            <label htmlFor="password" className={labelBase}>
              Kata sandi
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 top-4 text-[#A99BC2] transition-colors hover:text-[#B5860F]"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 text-[#8B7F9C]">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-[#E7DCC2] text-[#CBA135] focus:ring-[#CBA135]"
              />
              Ingat saya
            </label>
            <a href="#" className="font-medium text-[#B5860F] hover:text-[#8B6508]">
              Lupa kata sandi?
            </a>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-[#F7E9E4] px-3 py-2.5 text-xs font-medium text-[#9C4A2B]">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#1B1033] py-3.5 text-sm font-semibold text-[#FBF6EC] transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#CBA135]/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            {loading ? (
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#E8C766]" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#E8C766]" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#E8C766]" style={{ animationDelay: "300ms" }} />
              </span>
            ) : (
              <>
                Masuk
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <TumpalBorder className="relative z-10 mt-8 h-3 w-full" count={12} color="#E7DCC2" />
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

        .font-display {
          font-family: "Fraunces", serif;
          font-weight: 560;
          letter-spacing: -0.01em;
        }
        body {
          font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
        }

        .login-password-input::-ms-reveal,
        .login-password-input::-ms-clear {
          display: none;
        }

        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .login-card-in {
          animation: cardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(3px); }
        }
        .shake {
          animation: shakeX 0.45s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .login-card-in,
          .shake {
            animation: none !important;
          }
          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}