import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { generateOtpCode } from "@/lib/auth/credentials";
import { buildOtpExpiredAtIso, getRemainingCooldownSeconds } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/auth/otp-email";

type ResendOtpRequestBody = {
  email?: string;
};

function jsonError(message: string, status = 400, retryAfterSeconds?: number) {
  const payload: Record<string, string | number> = { error: message };
  if (retryAfterSeconds !== undefined) {
    payload.retryAfterSeconds = retryAfterSeconds;
  }
  return NextResponse.json(payload, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResendOtpRequestBody;
    const email = body.email?.trim().toLowerCase() ?? "";

    if (!email) {
      return jsonError("Email wajib diisi.");
    }

    const supabase = await createClient();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, username, email, email_verified_at")
      .eq("email", email)
      .maybeSingle();

    if (userError) {
      return jsonError(userError.message, 500);
    }

    if (!user) {
      return jsonError("Akun tidak ditemukan.", 404);
    }

    if (user.email_verified_at) {
      return jsonError("Email sudah terverifikasi.", 400);
    }

    const { data: latestOtp, error: latestOtpError } = await supabase
      .from("user_otps")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestOtpError) {
      return jsonError(latestOtpError.message, 500);
    }

    if (latestOtp?.created_at) {
      const remainingSeconds = getRemainingCooldownSeconds(latestOtp.created_at);
      if (remainingSeconds > 0) {
        return jsonError(
          "Permintaan OTP terlalu sering. Coba lagi sebentar.",
          429,
          remainingSeconds,
        );
      }
    }

    const otp = generateOtpCode();
    const expiredAt = buildOtpExpiredAtIso();

    await supabase.from("user_otps").delete().eq("user_id", user.id);

    const { error: insertOtpError } = await supabase.from("user_otps").insert({
      user_id: user.id,
      otp,
      expired_at: expiredAt,
    });

    if (insertOtpError) {
      return jsonError(insertOtpError.message, 500);
    }

    try {
      await sendOtpEmail({
        to: user.email,
        name: user.username,
        otp,
        expiredAtIso: expiredAt,
      });
    } catch (error) {
      await supabase.from("user_otps").delete().eq("user_id", user.id);
      const message = error instanceof Error ? error.message : "Gagal mengirim email OTP.";
      return jsonError(message, 500);
    }

    const payload: Record<string, string> = {
      message: "OTP baru berhasil dikirim.",
      expiredAt,
    };

    if (process.env.NODE_ENV !== "production") {
      payload.debugOtp = otp;
    }

    return NextResponse.json(payload);
  } catch {
    return jsonError("Terjadi kesalahan pada server.", 500);
  }
}
