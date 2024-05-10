import { type TDATA } from "~/models/TDATA";

export default defineEventHandler(async event => {
  const id = event.context.params?.id;
  
  
  return $fetch<TDATA[]>(
    `https://localhost:7109/searching/${id}`
    );


});