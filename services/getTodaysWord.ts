import { type TDATA } from "~/models/TDATA";

export const getTodaysWord = async () => {

    return $fetch<TDATA[]>(
        `https://localhost:7109/GetTodaysWord`
      );
}