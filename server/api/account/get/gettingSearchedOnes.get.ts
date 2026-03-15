import { type LOSTANDFOUND } from "~/models/LOSTANDFOUND";


export default defineEventHandler(async (event) => {
  const token = getCookie(event, "access_token")

  
    return $fetch<LOSTANDFOUND[]>
    (
        `http://localhost:5000/gettingSearchedOnes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`

          },
        }
      );

});
  