import { type TDATA } from "~/models/TDATA";


export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const token = getCookie(event, "access_token")

  return $fetch<TDATA[]>(`http://localhost:5000/searchingbyid/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
});
