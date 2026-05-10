import { AuthFormCard } from "@/app/features/auth/components/AuthFormCard";

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
  {
    id: "confirmPassword",
    type: "password" as const,
    placeholder: "Konfirmasi password",
    autoComplete: "current-password",
  },
];

export default function RegisterPage() {
  return (
    <AuthFormCard
      title="Daftar"
      description="Buat akun baru untuk melanjutkan."
      submitLabel="Daftar"
      fields={LOGIN_FIELDS}
      footerText="Sudah punya akun?"
      footerLinkText="Login"
      footerHref="/login"
    />
  );
}
