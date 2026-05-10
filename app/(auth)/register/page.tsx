import { Navbar } from "@/app/components/ui/Navbar";
import { RegisterFormCard } from "@/app/features/auth/components/RegisterFormCard";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-100 dark:bg-[#121212]">
      <Navbar />
      <section className="flex flex-1 items-center justify-center px-4 py-10">
        <RegisterFormCard />
      </section>
    </main>
  );
}
