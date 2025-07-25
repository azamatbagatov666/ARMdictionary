import { type AuthenticateResponse } from "~/models/AuthenticateResponse";


export default defineEventHandler(async event => {

    const req = await readBody(event);

  try {
    return await $fetch<AuthenticateResponse>("http://localhost:5000/Authentication/Login", {
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