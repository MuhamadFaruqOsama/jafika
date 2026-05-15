"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { toast } from "sonner";
import Button from "@/app/components/ui/Button";

type VerifyOtpResponse = {
  error?: string;
  message?: string;
  retryAfterSeconds?: number;
};

export function VerifyOtpFormCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const hasShownRegisteredToast = useRef(false);

  useEffect(() => {
    const registeredParam = searchParams.get("registered") === "1";

    if (registeredParam && !hasShownRegisteredToast.current) {
      toast.success("Registrasi berhasil. Kode OTP sudah dikirim ke email kamu.");
      hasShownRegisteredToast.current = true;
    }
  }, [searchParams]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp,
        }),
      });

      const payload = (await response.json()) as VerifyOtpResponse;

      if (!response.ok) {
        toast.error(payload.error ?? "Verifikasi OTP gagal.");
        return;
      }

      toast.success(payload.message ?? "OTP valid.");
      router.push("/login");
    } catch {
      toast.error("Terjadi kendala jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (resendCooldown > 0) return;

    setResendLoading(true);

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
      });

      const payload = (await response.json()) as VerifyOtpResponse;

      if (!response.ok) {
        if (response.status === 429 && payload.retryAfterSeconds) {
          setResendCooldown(payload.retryAfterSeconds);
        }
        toast.error(payload.error ?? "Gagal mengirim ulang OTP.");
        return;
      }

      toast.success(payload.message ?? "OTP baru berhasil dikirim.");
      setResendCooldown(60);
    } catch {
      toast.error("Terjadi kendala jaringan. Coba lagi.");
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

        <div className="mt-5 border-t border-gray-200 pt-5">
          <Button
            type="submit"
            variant="secondary"
            disabled={loading}
            className="w-full justify-center rounded-full text-base font-bold"
          >
            {loading ? "Memproses..." : "Verifikasi OTP"}
          </Button>
        </div>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
        Belum menerima OTP?{" "}
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            if (resendLoading || resendCooldown > 0) return;
            handleResendOtp();
          }}
          aria-disabled={resendLoading || resendCooldown > 0}
          className={`font-semibold hover:underline ${
            resendLoading || resendCooldown > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-pink-500"
          }`}
        >
          {resendLoading
            ? "Mengirim OTP..."
            : resendCooldown > 0
              ? `Kirim Ulang OTP (${resendCooldown}s)`
              : "Kirim Ulang OTP"}
        </a>
      </p>
    </div>
  );
}
