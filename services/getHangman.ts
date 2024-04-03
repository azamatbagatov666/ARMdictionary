import { type TDATA } from "~/models/TDATA";
export const getHangman = async () => {

    return $fetch<TDATA[]>(
        `https://localhost:7109/getHangman`
      );
}