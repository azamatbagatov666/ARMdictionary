import { type TDATA } from "~/models/TDATA";

export async function getHangman() {
    return $fetch<TDATA[]>(
        `https://localhost:7109/getHangman`
      );
}