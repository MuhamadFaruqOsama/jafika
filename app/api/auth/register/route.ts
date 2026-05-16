import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      const isAlreadyRegistered = /already registered/i.test(error.message);
      return jsonError(
        isAlreadyRegistered ? "Email sudah terdaftar." : error.message,
        isAlreadyRegistered ? 409 : 400,
      );
    }

    return NextResponse.json(
      { message: "Registrasi berhasil." },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
    return jsonError(message, 500);
  }
}