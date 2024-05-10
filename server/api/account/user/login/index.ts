import { AuthenticateRequest, type AuthenticateResponse } from "~/models/AuthenticateResponse";


export default defineEventHandler(async event => {

    const req = await readBody<AuthenticateRequest>(event);

  try {
    return await $fetch<AuthenticateResponse>("https://localhost:7109/Authentication/Login", {
      method: 'GET',
      query: {
        Username: req.username,
        Password: req.password
      }
    });
  } 
  catch (error) {

    throw error;
  }

  });