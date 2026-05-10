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
];

export default function LoginPage() {
  return (
    <AuthFormCard
      title="Login"
      description="Masukkan email dan password Anda untuk melanjutkan."
      submitLabel="Masuk"
      fields={LOGIN_FIELDS}
      footerText="Belum punya akun?"
      footerLinkText="Daftar"
      footerHref="/register"
    />
  );
}
