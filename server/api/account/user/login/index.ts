import type { AuthenticateResponse } from "~/models/AuthenticateResponse";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;



    
  const data = await $fetch<AuthenticateResponse>(
    "http://localhost:5000/Authentication/Login",
    {
      method: "POST",
      body: {
        Username: username,
        Password: password,
      },
    }
  );
  setCookie(event, "access_token", data.accessToken, {
    httpOnly: true,
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
    sameSite: "lax",
    path: "/api/account/user",
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    id: data.id,
    username: data.username,
  };

  

    

});

