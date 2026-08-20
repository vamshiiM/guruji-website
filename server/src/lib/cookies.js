import { env } from "../config/env.js";

export const COOKIE_NAME = "divya_token";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Base attributes shared by set + clear. In prod the cookie is Secure and scoped
// to the shared parent domain (".yourdomain.com") so it works across the frontend
// and the api. subdomain with SameSite=Lax. In dev it's a host-only localhost cookie.
function baseOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProd,
    domain: env.cookieDomain, // undefined in dev
    path: "/",
  };
}

export const setCookieOptions = () => ({ ...baseOptions(), maxAge: SEVEN_DAYS_MS });

// clearCookie must match the same domain/path/flags to actually remove the cookie.
export const clearCookieOptions = () => baseOptions();
