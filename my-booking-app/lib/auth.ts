// lib/auth.ts
import bcrypt from "bcrypt";
import jwt, { JwtPayload as DefaultJwtPayload , SignOptions } from "jsonwebtoken";
import type { JwtPayload } from "@/types/jwt";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";

const SALT_ROUNDS = 10;

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}

export function signJwt<T extends object>(payload: T): string {
  const secret = process.env.JWT_SECRET;
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"];

  if (!secret) throw new Error("JWT_SECRET is not defined");

  const options: SignOptions = { expiresIn };

  return jwt.sign(payload, secret, options);
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") {
      return null; // payload shouldn't be a string
    }

    // Merge types if needed
    const payload = decoded as DefaultJwtPayload & Partial<JwtPayload>;

    // Optional runtime validation
    if (!payload.sub || !payload.email) {
      return null;
    }

    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export function getSessionPayload(req: Request): JwtPayload | null {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(/session=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;
  if (!token) return null;

  return verifyJwt(token);
}

export function requireUser(req: Request): JwtPayload {
  const payload = getSessionPayload(req);
  if (!payload) throw new AuthenticationError("Authentication required");
  return payload;
}

export function requireAdmin(req: Request): JwtPayload {
  const payload = requireUser(req);
  if (payload.role !== "admin") {
    throw new AuthorizationError("Admin access required");
  }
  return payload;
}

