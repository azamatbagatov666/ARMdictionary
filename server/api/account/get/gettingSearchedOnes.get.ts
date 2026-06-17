import { type LOSTANDFOUND } from "~/models/LOSTANDFOUND";


export default defineEventHandler(async (event) => {
  const token = getCookie(event, "access_token")
   const query = getQuery(event);
  const page = query.page;


  
    return $fetch<LOSTANDFOUND[]>
    (
        `http://localhost:5000/gettingSearchedOnes?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`

          },
        }
      );

});
  