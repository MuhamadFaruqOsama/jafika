import { Navbar } from "@/app/components/ui/Navbar";
import { VerifyOtpFormCard } from "@/app/features/auth/components/VerifyOtpFormCard";

export default function VerifyOtpPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-100 dark:bg-[#121212]">
      <Navbar />
      <section className="flex flex-1 items-center justify-center px-4 py-10">
        <VerifyOtpFormCard />
      </section>
    </main>
  );
}
