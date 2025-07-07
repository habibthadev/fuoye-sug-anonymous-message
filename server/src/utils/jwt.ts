import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import type { JWTPayload } from "@/types";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const jwtSignOptions: SignOptions = {
  expiresIn: "7d",
  issuer: "anonymous-messaging-api",
  audience: "anonymous-messaging-admin",
};

const jwtVerifyOptions: VerifyOptions = {
  issuer: "anonymous-messaging-api",
  audience: "anonymous-messaging-admin",
};

export const generateToken = (payload: { adminId: string; email: string }): string => {
  return jwt.sign(payload, JWT_SECRET, jwtSignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET, jwtVerifyOptions) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};