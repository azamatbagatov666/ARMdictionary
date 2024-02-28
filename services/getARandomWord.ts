import { type TDATA } from "~/models/TDATA";

export async function getARandomWord() {
    return useFetch<TDATA[]>(
        `https://localhost:7109/getRandom`
      );
}