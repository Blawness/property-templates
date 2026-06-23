import "dotenv/config";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!process.env.AUTH_SECRET) throw new Error("AUTH_SECRET is required");

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  R2_BUCKET: process.env.R2_BUCKET || "",
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL || "",
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || "",
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || "",
  R2_ENDPOINT: process.env.R2_ENDPOINT || "",
};
