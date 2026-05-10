import { Navbar } from "@/app/components/ui/Navbar";
import { AuthFormCard } from "@/app/features/auth/components/AuthFormCard";

const LOGIN_FIELDS = [
  {
    id: "email",
    label: "Email",
    type: "email" as const,
    placeholder: "contoh: kamu@email.com",
    autoComplete: "email",
  },
  {
    id: "password",
    label: "Password",
    type: "password" as const,
    placeholder: "Masukkan password",
    autoComplete: "current-password",
  },
];

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-100 dark:bg-[#121212]">
      <Navbar />
      <section className="flex flex-1 items-center justify-center px-4 py-10">
        <AuthFormCard
          title="Login"
          description="Masuk untuk melanjutkan belajar di JAFIKA."
          submitLabel="Masuk"
          fields={LOGIN_FIELDS}
          footerText="Belum punya akun?"
          footerLinkText="Daftar"
          footerHref="/register"
        />
      </section>
    </main>
  );
}
