import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { generateOtpCode, hashPassword } from "@/lib/auth/credentials";
import { buildOtpExpiredAtIso } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/auth/otp-email";

type RegisterRequestBody = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterRequestBody;
    const username = body.username?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const confirmPassword = body.confirmPassword ?? "";

    if (!username || !email || !password || !confirmPassword) {
      return jsonError("Semua field wajib diisi.");
    }

    if (username.length < 3) {
      return jsonError("Username minimal 3 karakter.");
    }

    if (!email.includes("@")) {
      return jsonError("Format email tidak valid.");
    }

    if (password.length < 8) {
      return jsonError("Password minimal 8 karakter.");
    }

    if (password !== confirmPassword) {
      return jsonError("Konfirmasi password tidak sama.");
    }

    const supabase = await createClient();

    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUserError) {
      return jsonError(existingUserError.message, 500);
    }

    if (existingUser) {
      return jsonError("Email sudah terdaftar.", 409);
    }

    const passwordHash = await hashPassword(password);

    const { data: createdUser, error: createUserError } = await supabase
      .from("users")
      .insert({
        username,
        email,
        email_verified_at: null,
        password: passwordHash,
      })
      .select("id, email")
      .single();

    if (createUserError || !createdUser) {
      return jsonError(createUserError?.message ?? "Gagal membuat akun.", 500);
    }

    const otp = generateOtpCode();
    const expiredAt = buildOtpExpiredAtIso();

    const { error: otpError } = await supabase.from("user_otps").insert({
      user_id: createdUser.id,
      otp,
      expired_at: expiredAt,
    });

    if (otpError) {
      await supabase.from("users").delete().eq("id", createdUser.id);
      return jsonError(otpError.message, 500);
    }

    try {
      await sendOtpEmail({
        to: createdUser.email,
        name: username,
        otp,
        expiredAtIso: expiredAt,
      });
    } catch (error) {
      await supabase.from("user_otps").delete().eq("user_id", createdUser.id);
      await supabase.from("users").delete().eq("id", createdUser.id);
      const message = error instanceof Error ? error.message : "Gagal mengirim email OTP.";
      return jsonError(message, 500);
    }

    const payload: Record<string, string> = {
      message: "Registrasi berhasil. Lanjut konfirmasi OTP.",
      email: createdUser.email,
      expiredAt,
    };

    if (process.env.NODE_ENV !== "production") {
      payload.debugOtp = otp;
    }

    return NextResponse.json(payload, { status: 201 });
  } catch {
    return jsonError("Terjadi kesalahan pada server.", 500);
  }
}
