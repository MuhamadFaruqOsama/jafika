import { randomBytes, randomInt, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scryptCallback);
const OTP_DIGIT_LENGTH = 6;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const expectedBuffer = Buffer.from(hash, "hex");
  const passwordBuffer = (await scryptAsync(password, salt, expectedBuffer.length)) as Buffer;

  if (expectedBuffer.length !== passwordBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, passwordBuffer);
}

export function generateOtpCode() {
  const min = 10 ** (OTP_DIGIT_LENGTH - 1);
  const max = 10 ** OTP_DIGIT_LENGTH;
  return String(randomInt(min, max));
}
