import { type WORDOFTHEDAY } from "~/models/WORDOFTHEDAY";



export default defineEventHandler(async (event) => {


  const req = await readBody(event);




  const token = event.headers.get("token")
  if (!token) return;

  return $fetch<WORDOFTHEDAY[]>
  (
      `https://localhost:7109/GetWordOfTheDay?START=${req.start}&END=${req.end}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },

      }
    );


});
