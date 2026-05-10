"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import Button from "@/app/components/ui/Button";

type VerifyOtpResponse = {
  error?: string;
  message?: string;
  retryAfterSeconds?: number;
  debugOtp?: string;
};

export function VerifyOtpFormCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [debugOtp, setDebugOtp] = useState(searchParams.get("debugOtp") ?? "");

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const payload = (await response.json()) as VerifyOtpResponse;

      if (!response.ok) {
        setError(payload.error ?? "Verifikasi OTP gagal.");
        return;
      }

      setSuccess(payload.message ?? "OTP valid.");
      router.push("/login");
    } catch {
      setError("Terjadi kendala jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (resendCooldown > 0) return;

    setError("");
    setSuccess("");
    setResendLoading(true);

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const payload = (await response.json()) as VerifyOtpResponse;

      if (!response.ok) {
        if (response.status === 429 && payload.retryAfterSeconds) {
          setResendCooldown(payload.retryAfterSeconds);
        }
        setError(payload.error ?? "Gagal mengirim ulang OTP.");
        return;
      }

      if (payload.debugOtp) {
        setDebugOtp(payload.debugOtp);
      }
      setSuccess(payload.message ?? "OTP baru berhasil dikirim.");
      setResendCooldown(60);
    } catch {
      setError("Terjadi kendala jaringan. Coba lagi.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-4xl border border-gray-200 bg-white px-5 py-6 shadow-sm dark:border-gray-800/50 dark:bg-black/40">
      <div className="mb-5 border-b border-gray-200 pb-5 text-center">
        <h1 className="text-3xl font-bold text-pink-500">Konfirmasi OTP</h1>
        <div className="text-sm text-gray-600">
          Masukkan kode OTP yang dikirimkan ke email kamu.
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="email" className="ms-3 text-sm text-gray-600">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="contoh: kamu@email.com"
            autoComplete="email"
            className="w-full rounded-full border-3 border-pink-500 bg-gray-50 px-4 py-2 outline-none shadow-pink-500/50 focus:shadow-md focus:outline-pink-500 dark:bg-black dark:text-white"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="otp" className="ms-3 text-sm text-gray-600">
            OTP
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Contoh: 123456"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="w-full rounded-full border-3 border-pink-500 bg-gray-50 px-4 py-2 outline-none shadow-pink-500/50 focus:shadow-md focus:outline-pink-500 dark:bg-black dark:text-white"
            required
          />
        </div>

        {debugOtp && (
          <p className="text-center text-xs text-pink-500">
            OTP dev mode: <span className="font-bold">{debugOtp}</span>
          </p>
        )}

        {error && <p className="text-center text-sm font-medium text-red-500">{error}</p>}
        {success && <p className="text-center text-sm font-medium text-green-600">{success}</p>}

        <div className="mt-5 border-t border-gray-200 pt-5">
          <Button
            type="submit"
            variant="secondary"
            disabled={loading}
            className="w-full justify-center rounded-full text-base font-bold"
          >
            {loading ? "Memproses..." : "Verifikasi OTP"}
          </Button>

          <Button
            type="button"
            variant="main"
            disabled={resendLoading || resendCooldown > 0}
            onClick={handleResendOtp}
            className="mt-3 w-full justify-center rounded-full text-base font-bold"
          >
            {resendLoading
              ? "Mengirim OTP..."
              : resendCooldown > 0
                ? `Kirim Ulang OTP (${resendCooldown}s)`
                : "Kirim Ulang OTP"}
          </Button>
        </div>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
        Sudah verifikasi?{" "}
        <Link href="/login" className="font-semibold text-pink-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
