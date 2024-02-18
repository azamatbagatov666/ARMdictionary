import { type TDATA } from "~/models/TDATA";

export async function searching(query: string) {
    return useFetch<TDATA[]>(
        `https://localhost:7109/searching/${query}`
      );
}