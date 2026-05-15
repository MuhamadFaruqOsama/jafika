import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  buildClearPendingEmailCookie,
  buildClearResendCooldownCookie,
  getPendingEmailCookieName,
} from "@/lib/auth/pending-email";
import { createClient } from "@/lib/server";

type VerifyOtpRequestBody = {
  otp?: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyOtpRequestBody;
    const otp = body.otp?.trim() ?? "";

    if (!otp) {
      return jsonError("OTP wajib diisi.");
    }

    if (!/^\d{6}$/.test(otp)) {
      return jsonError("OTP harus 6 digit angka.");
    }

    const cookieStore = await cookies();
    const pendingEmail = cookieStore.get(getPendingEmailCookieName())?.value;
    if (!pendingEmail) {
      return jsonError("Sesi verifikasi tidak ditemukan. Silakan daftar ulang.", 401);
    }

    const supabase = await createClient();
    const otpTypes = ["email", "signup"] as const;
    let lastErrorMessage = "OTP tidak valid atau sudah kedaluwarsa.";
    let isVerified = false;

    for (const type of otpTypes) {
      const { error } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token: otp,
        type,
      });

      if (!error) {
        isVerified = true;
        break;
      }

      lastErrorMessage = error.message;
    }

    if (!isVerified) {
      return jsonError(lastErrorMessage, 400);
    }

    const response = NextResponse.json({ message: "OTP valid. Email berhasil diverifikasi." });
    const clearPendingEmail = buildClearPendingEmailCookie();
    const clearCooldown = buildClearResendCooldownCookie();
    response.cookies.set(
      clearPendingEmail.name,
      clearPendingEmail.value,
      clearPendingEmail.options,
    );
    response.cookies.set(clearCooldown.name, clearCooldown.value, clearCooldown.options);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
    return jsonError(message, 500);
  }
}
