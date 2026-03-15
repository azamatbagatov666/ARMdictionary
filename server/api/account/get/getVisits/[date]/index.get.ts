import { type VISITS } from "~/models/VISITS";


export default defineEventHandler(async (event) => {
  const query = event.context.params?.date;
  const token = getCookie(event, "access_token")


  return $fetch<VISITS[]>(`http://localhost:5000/getVisits/${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`

    },
  });
});
