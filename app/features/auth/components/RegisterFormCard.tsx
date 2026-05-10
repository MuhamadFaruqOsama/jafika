"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next-nprogress-bar";
import Button from "@/app/components/ui/Button";

type RegisterResponse = {
  error?: string;
  debugOtp?: string;
};

export function RegisterFormCard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
        }),
      });

      const payload = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        setError(payload.error ?? "Registrasi gagal.");
        return;
      }

      const params = new URLSearchParams({ email: email.trim().toLowerCase() });
      if (payload.debugOtp) {
        params.set("debugOtp", payload.debugOtp);
      }

      router.push(`/verify-otp?${params.toString()}`);
    } catch {
      setError("Terjadi kendala jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-4xl border border-gray-200 bg-white px-5 py-6 shadow-sm dark:border-gray-800/50 dark:bg-black/40">
      <div className="mb-5 border-b border-gray-200 pb-5 text-center">
        <h1 className="text-3xl font-bold text-pink-500">Register</h1>
        <div className="text-sm text-gray-600">Buat akun baru untuk mulai belajar di JAFIKA.</div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="username" className="ms-3 text-sm text-gray-600">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Masukkan username"
            autoComplete="username"
            className="w-full rounded-full border-3 border-pink-500 bg-gray-50 px-4 py-2 outline-none shadow-pink-500/50 focus:shadow-md focus:outline-pink-500 dark:bg-black dark:text-white"
            required
          />
        </div>

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
          <label htmlFor="password" className="ms-3 text-sm text-gray-600">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Buat password"
            autoComplete="new-password"
            className="w-full rounded-full border-3 border-pink-500 bg-gray-50 px-4 py-2 outline-none shadow-pink-500/50 focus:shadow-md focus:outline-pink-500 dark:bg-black dark:text-white"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="confirm_password" className="ms-3 text-sm text-gray-600">
            Konfirmasi Password
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Ulangi password"
            autoComplete="new-password"
            className="w-full rounded-full border-3 border-pink-500 bg-gray-50 px-4 py-2 outline-none shadow-pink-500/50 focus:shadow-md focus:outline-pink-500 dark:bg-black dark:text-white"
            required
          />
        </div>

        {error && <p className="text-center text-sm font-medium text-red-500">{error}</p>}

        <div className="mt-5 border-t border-gray-200 pt-5">
          <Button
            type="submit"
            variant="secondary"
            disabled={loading}
            className="w-full justify-center rounded-full text-base font-bold"
          >
            {loading ? "Memproses..." : "Daftar"}
          </Button>
        </div>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-pink-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
