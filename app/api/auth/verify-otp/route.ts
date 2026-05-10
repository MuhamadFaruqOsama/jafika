import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

type VerifyOtpRequestBody = {
  email?: string;
  otp?: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyOtpRequestBody;
    const email = body.email?.trim().toLowerCase() ?? "";
    const otp = body.otp?.trim() ?? "";

    if (!email || !otp) {
      return jsonError("Email dan OTP wajib diisi.");
    }

    if (!/^\d{6}$/.test(otp)) {
      return jsonError("OTP harus 6 digit angka.");
    }

    const supabase = await createClient();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email_verified_at")
      .eq("email", email)
      .maybeSingle();

    if (userError) {
      return jsonError(userError.message, 500);
    }

    if (!user) {
      return jsonError("Akun tidak ditemukan.", 404);
    }

    if (user.email_verified_at) {
      return NextResponse.json({ message: "Email sudah terverifikasi." });
    }

    const nowIso = new Date().toISOString();
    const { data: otpRow, error: otpError } = await supabase
      .from("user_otps")
      .select("id, expired_at")
      .eq("user_id", user.id)
      .eq("otp", otp)
      .gte("expired_at", nowIso)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (otpError) {
      return jsonError(otpError.message, 500);
    }

    if (!otpRow) {
      return jsonError("OTP tidak valid atau sudah kadaluarsa.", 400);
    }

    const verifiedAt = new Date().toISOString();

    const { error: verifyError } = await supabase
      .from("users")
      .update({ email_verified_at: verifiedAt })
      .eq("id", user.id);

    if (verifyError) {
      return jsonError(verifyError.message, 500);
    }

    await supabase.from("user_otps").delete().eq("id", otpRow.id);

    return NextResponse.json({
      message: "OTP valid. Email berhasil diverifikasi.",
      emailVerifiedAt: verifiedAt,
    });
  } catch {
    return jsonError("Terjadi kesalahan pada server.", 500);
  }
}
