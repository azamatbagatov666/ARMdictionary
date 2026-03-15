import { type TDATA } from "~/models/TDATA";


export default defineEventHandler(async (event) => {
  const query = event.context.params?.id;
  const token = getCookie(event, "access_token")


  return $fetch<TDATA[]>(`http://localhost:5000/searchingnocheck?word=${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
    },
  });
});
