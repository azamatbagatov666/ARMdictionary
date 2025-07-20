import { type TDATA } from "~/models/TDATA";

export default defineEventHandler(async event => {
    return await $fetch<TDATA[]>(
        `http://localhost:5000/getHangman`
      );
});