"use client";

import { useState } from "react";
import { useRouter } from "next-nprogress-bar";
import { toast } from "sonner";
import { AuthFormCard } from "@/app/features/auth/components/AuthFormCard";
import { createClient } from "@/lib/client";

const LOGIN_FIELDS = [
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
    autoComplete: "current-password",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({
    email: "",
    password: "",
  });

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleLogin = async (values: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Login berhasil.");
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
  // - kembalikan state/loading + handleGoogleSignIn + extraActions button

  return (
    <AuthFormCard
      title="Login"
      description="Masukkan email dan password Anda untuk melanjutkan."
      submitLabel={isSubmitting ? "Memproses..." : "Masuk"}
      fields={LOGIN_FIELDS}
      footerText="Belum punya akun?"
      footerLinkText="Daftar"
      footerHref="/register"
      onSubmit={handleLogin}
      submitDisabled={isSubmitting}
      values={formValues}
      onFieldChange={handleFieldChange}
    />
  );
}
