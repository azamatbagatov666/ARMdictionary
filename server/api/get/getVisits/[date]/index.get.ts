import { type VISITS } from "~/models/VISITS";


export default defineEventHandler(async (event) => {
  const query = event.context.params?.date;
  const token = event.headers.get("token")
  if (!token) return;

  return $fetch<VISITS[]>(`http://localhost:5000/getVisits/${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
});
