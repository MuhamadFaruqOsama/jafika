const PENDING_EMAIL_COOKIE = "pending_signup_email"
const OTP_RESEND_COOLDOWN_COOKIE = "otp_resend_cooldown_until"
const OTP_RESEND_COOLDOWN_SECONDS = 60

function baseCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  }
}

export function buildPendingEmailCookie(email: string) {
  return {
    name: PENDING_EMAIL_COOKIE,
    value: email,
    options: {
      ...baseCookieOptions(),
      maxAge: 60 * 60,
    },
  }
}

export function buildClearPendingEmailCookie() {
  return {
    name: PENDING_EMAIL_COOKIE,
    value: "",
    options: {
      ...baseCookieOptions(),
      maxAge: 0,
    },
  }
}

export function buildResendCooldownCookie(fromDate = Date.now()) {
  const availableAt = fromDate + OTP_RESEND_COOLDOWN_SECONDS * 1000

  return {
    name: OTP_RESEND_COOLDOWN_COOKIE,
    value: String(availableAt),
    options: {
      ...baseCookieOptions(),
      maxAge: OTP_RESEND_COOLDOWN_SECONDS,
    },
  }
}

export function buildClearResendCooldownCookie() {
  return {
    name: OTP_RESEND_COOLDOWN_COOKIE,
    value: "",
    options: {
      ...baseCookieOptions(),
      maxAge: 0,
    },
  }
}

export function getPendingEmailCookieName() {
  return PENDING_EMAIL_COOKIE
}

export function getResendCooldownCookieName() {
  return OTP_RESEND_COOLDOWN_COOKIE
}

