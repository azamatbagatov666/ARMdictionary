import { type WORDOFTHEDAY } from "~/models/WORDOFTHEDAY";



export default defineEventHandler(async (event) => {


  const req = await readBody(event);




  const token = getCookie(event, "access_token")


  return $fetch<WORDOFTHEDAY[]>
  (
      `http://localhost:5000/GetWordOfTheDay?START=${req.start}&END=${req.end}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },

      }
    );


});
