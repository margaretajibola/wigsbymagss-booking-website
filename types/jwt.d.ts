// /types/jwt.d.ts
export interface JwtPayload {
  sub: number;
  email: string;
  name?: string;
  role: "admin" | "user";
  iat?: number;
  exp?: number;
}
