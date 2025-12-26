import { type TDATA } from "~/models/TDATA";

export default defineEventHandler(async event => {
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
  
  
  return $fetch<TDATA[]>(
    `http://localhost:5000/searching?word=${sanitized}`
    );


});