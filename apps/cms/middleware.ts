import NextAuth from "next-auth";
import { authConfig } from "@blawness/admin-kit/auth/config";

export const { auth: middleware } = NextAuth(authConfig);
export const config = { matcher: ["/admin/:path*"] };
