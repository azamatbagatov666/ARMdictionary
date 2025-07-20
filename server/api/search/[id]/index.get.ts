import { type TDATA } from "~/models/TDATA";

export default defineEventHandler(async event => {
  const id = event.context.params?.id;
  
  
  return $fetch<TDATA[]>(
    `http://localhost:5000/searching/${id}`
    );


});