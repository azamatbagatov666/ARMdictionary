import { type TDATA } from "~/models/TDATA";


export default defineEventHandler(async (event) => {
  const query = event.context.params?.id;
  const token = event.headers.get("token")
  if (!token) return;

  return $fetch<TDATA[]>(`http://localhost:5000/searchingnocheck/${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
});
