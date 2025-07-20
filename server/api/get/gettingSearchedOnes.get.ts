import { type LOSTANDFOUND } from "~/models/LOSTANDFOUND";


export default defineEventHandler(async (event) => {
    const token = event.headers.get("token")
    if (!token) return;
  
    return $fetch<LOSTANDFOUND[]>
    (
        `http://localhost:5000/gettingSearchedOnes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
        }
      );

});
  