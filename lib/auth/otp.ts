export const OTP_EXPIRES_IN_MS = 60 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

const OTP_TIME_ZONE = "Asia/Jakarta";

export function buildOtpExpiredAtIso(fromDate = new Date()) {
  return new Date(fromDate.getTime() + OTP_EXPIRES_IN_MS).toISOString();
}

export function formatOtpExpiryForEmail(expiredAtIso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: OTP_TIME_ZONE,
  }).format(new Date(expiredAtIso));
}

export function getRemainingCooldownSeconds(lastCreatedAtIso: string) {
  const elapsedMs = Date.now() - new Date(lastCreatedAtIso).getTime();
  const remainingMs = Math.max(0, OTP_RESEND_COOLDOWN_MS - elapsedMs);
  return Math.ceil(remainingMs / 1000);
}
