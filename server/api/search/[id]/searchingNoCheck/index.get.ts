import { type TDATA } from "~/models/TDATA";


export default defineEventHandler(async (event) => {
  function sanitizeAranan(value: string): string {
  return value
    .normalize('NFD')          // split accents
    .replace(/\u0302/g, '')    // remove circumflex
    .normalize('NFC')          // recompose
    .replace(/[.!?՝՛՞՜']/g, '');
}

    const id = event.context.params?.id;
    if (!id) {
    return [];
  }
  const sanitized = encodeURIComponent(sanitizeAranan(decodeURIComponent(id)));
  const token = event.headers.get("token")
  if (!token) return;

  return $fetch<TDATA[]>(`http://localhost:5000/searchingnocheck?word=${sanitized}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
});
