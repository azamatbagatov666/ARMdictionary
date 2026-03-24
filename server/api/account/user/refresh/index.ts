import type { AuthenticateResponse } from "~/models/AuthenticateResponse";

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refresh_token");

  const isProd = process.env.NODE_ENV === "production";

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "No refresh token",
    });
  }

  const data = await $fetch<AuthenticateResponse>(
    "http://localhost:5000/Authentication/Refresh",
    {
      method: "POST",
      body: { refreshToken },
    }
  );

  setCookie(event, "access_token", data.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  setCookie(event, "session", "1", {
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  setCookie(event, "refresh_token", data.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/api/account/user",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { ok: true };
});