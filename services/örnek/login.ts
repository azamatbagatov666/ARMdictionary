import { type AuthenticateResponse } from "~/models/AuthenticateResponse";

export const loginRequest = async (username: string, password: string) => {
  try {
    return await $fetch<AuthenticateResponse>("https://localhost:7109/Authentication/Login", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      query: {
        username: username,
        password: password
      }
    });
  } catch (error) {
    throw error;
  }
};
