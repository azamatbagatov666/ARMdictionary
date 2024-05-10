import { type TDATA } from "~/models/TDATA";


export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const token = event.headers.get("token")
  if (!token) return;

  return $fetch<TDATA[]>(`https://localhost:7109/searchingbyid/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
});