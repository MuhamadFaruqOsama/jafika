import { Suspense } from "react";
import { VerifyOtpFormCard } from "@/app/features/auth/components/VerifyOtpFormCard";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpFormCard />
    </Suspense>
  );
}
