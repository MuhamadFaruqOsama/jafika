import nodemailer from "nodemailer";
import { formatOtpExpiryForEmail } from "@/lib/auth/otp";

type OtpEmailPayload = {
  to: string;
  name: string;
  otp: string;
  expiredAtIso: string;
};

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error("Konfigurasi SMTP belum lengkap.");
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user,
      pass,
    },
  });
}

function buildOtpEmailHtml({ name, otp, expiredAtIso }: OtpEmailPayload) {
  const expiredAtWib = formatOtpExpiryForEmail(expiredAtIso);
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="color: #db2777; margin-bottom: 12px;">Verifikasi Akun JAFIKA</h2>
      <p>Yth. <strong>${name}</strong>,</p>
      <p>Terima kasih telah melakukan pendaftaran akun di JAFIKA.</p>
      <p>Silakan gunakan kode OTP berikut untuk verifikasi email Anda:</p>
      <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #111827; margin: 16px 0;">
        ${otp}
      </p>
      <p>Kode OTP berlaku sampai: <strong>${expiredAtWib} WIB</strong>.</p>
      <p>Apabila Anda tidak melakukan permintaan ini, abaikan email ini.</p>
      <p>Hormat kami,<br/>Tim JAFIKA</p>
    </div>
  `;
}

function buildOtpEmailText({ name, otp, expiredAtIso }: OtpEmailPayload) {
  const expiredAtWib = formatOtpExpiryForEmail(expiredAtIso);
  return [
    `Yth. ${name},`,
    "",
    "Terima kasih telah melakukan pendaftaran akun di JAFIKA.",
    `Kode OTP verifikasi Anda adalah: ${otp}`,
    `Kode OTP berlaku sampai: ${expiredAtWib} WIB.`,
    "",
    "Apabila Anda tidak melakukan permintaan ini, abaikan email ini.",
    "",
    "Hormat kami,",
    "Tim JAFIKA",
  ].join("\n");
}

export async function sendOtpEmail(payload: OtpEmailPayload) {
  const fromName = process.env.SMTP_FROM_NAME || "JAFIKA";
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  if (!fromEmail) {
    throw new Error("Alamat pengirim email belum diatur.");
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `${fromName} <${fromEmail}>`,
    to: payload.to,
    subject: "Kode OTP Verifikasi Akun JAFIKA",
    text: buildOtpEmailText(payload),
    html: buildOtpEmailHtml(payload),
  });
}
