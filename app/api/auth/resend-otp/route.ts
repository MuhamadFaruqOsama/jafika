import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  buildResendCooldownCookie,
  getPendingEmailCookieName,
  getResendCooldownCookieName,
} from "@/lib/auth/pending-email";
import { createClient } from "@/lib/server";

function jsonError(message: string, status = 400, retryAfterSeconds?: number) {
  const payload: Record<string, string | number> = { error: message };
  if (retryAfterSeconds !== undefined) {
    payload.retryAfterSeconds = retryAfterSeconds;
  }
  return NextResponse.json(payload, { status });
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const pendingEmail = cookieStore.get(getPendingEmailCookieName())?.value;
    if (!pendingEmail) {
      return jsonError("Sesi verifikasi tidak ditemukan. Silakan daftar ulang.", 401);
    }

    const cooldownUntilRaw = cookieStore.get(getResendCooldownCookieName())?.value;
    const cooldownUntil = Number(cooldownUntilRaw ?? 0);
    if (cooldownUntil > Date.now()) {
      const remainingSeconds = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (remainingSeconds > 0) {
        return jsonError(
          "Permintaan OTP terlalu sering. Coba lagi sebentar.",
          429,
          remainingSeconds,
        );
      }
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: pendingEmail,
    });

    if (error) {
      return jsonError(error.message, 400);
    }

    const response = NextResponse.json({
      message: "OTP baru berhasil dikirim.",
    });
    const cooldownCookie = buildResendCooldownCookie();
    response.cookies.set(cooldownCookie.name, cooldownCookie.value, cooldownCookie.options);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
    return jsonError(message, 500);
  }
}
