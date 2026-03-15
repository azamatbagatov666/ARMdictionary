export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refresh_token");

  if (refreshToken) {
    try {
      await $fetch("http://localhost:5000/Authentication/Logout", {
        method: "POST",
        body: { refreshToken },
      });
    } catch {}
  }

  deleteCookie(event, "access_token", { path: "/" });
  deleteCookie(event, "refresh_token", { path: "/api/account/user" });
  deleteCookie(event, "session", { path: "/" });

  return { ok: true };
});