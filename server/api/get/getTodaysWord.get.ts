import { type TDATA } from "~/models/TDATA";

export default defineEventHandler(async event => {
    return await $fetch<TDATA[]>(
        `https://localhost:7109/GetTodaysWord`
      );
});