"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next-nprogress-bar";
import { toast } from "sonner";
import { AuthFormCard } from "@/app/features/auth/components/AuthFormCard";
import { HeaderAuth } from "@/app/components/ui/HeaderAuth";
import { createClient } from "@/lib/client";

const REGISTER_FIELDS = [
  {
    id: "username",
    type: "text" as const,
    placeholder: "Masukkan username",
    autoComplete: "username",
  },
  {
    id: "email",
    type: "email" as const,
    placeholder: "Masukkan email",
    autoComplete: "email",
  },
  {
    id: "password",
    type: "password" as const,
    placeholder: "Masukkan password",
    autoComplete: "new-password",
  },
  {
    id: "confirmPassword",
    type: "password" as const,
    placeholder: "Konfirmasi password",
    autoComplete: "new-password",
  },
];

type RegisterResponse = {
  error?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleRegister = async (values: Record<string, string>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        toast.error(payload.error ?? "Terjadi kesalahan saat registrasi.");
        return;
      }

      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        toast.error("Akun berhasil dibuat, tapi login otomatis gagal. Silakan login manual.");
        router.replace("/login");
        return;
      }

      toast.success("Registrasi berhasil. Selamat datang!");
      router.replace("/studio");
      router.refresh();
    } catch {
      toast.error("Terjadi kendala jaringan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth sengaja dinonaktifkan sementara.
  // Aktifkan lagi saat dibutuhkan:
  // - import Button dari "@/app/components/ui/Button"
  // - import createClient dari "@/lib/client"
  // - kembalikan state/loading + handleGoogleSignIn + extraActions button

  return (
    <div className="w-full max-w-md rounded-4xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800/50 dark:bg-black/40">
      <HeaderAuth
        title="Daftar"
        description="Buat akun baru untuk melanjutkan."
      />

      {/* Form registrasi dinonaktifkan sementara */}
      {/*
      <AuthFormCard
        title="Daftar"
        description="Buat akun baru untuk melanjutkan."
        submitLabel={isSubmitting ? "Memproses..." : "Daftar"}
        fields={REGISTER_FIELDS}
        footerText="Sudah punya akun?"
        footerLinkText="Login"
        footerHref="/login"
        onSubmit={handleRegister}
        submitDisabled={isSubmitting}
        values={formValues}
        onFieldChange={handleFieldChange}
      />
      */}

      <div className="my-8 text-center space-y-2">
        <p className="text-gray-600 dark:text-gray-300">
          Mohon maaf, saat ini service sedang tidak dapat diakses.
        </p>
      </div>

      <div className="border-t border-gray-200 pt-5 dark:border-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-300">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-pink-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
