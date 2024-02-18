import { type TDATA } from "~/models/TDATA";

export async function searchingnocheck(query: string) {
    return useFetch<TDATA[]>(
        `https://localhost:7109/searchingnocheck/${query}`
      );
}