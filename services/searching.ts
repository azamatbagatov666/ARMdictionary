import { type TDATA } from "~/models/TDATA";

export async function searching(query: string) {
  query = encodeURIComponent(query)
    return useFetch<TDATA[]>(
        `https://localhost:7109/searching/${query}`
      );
}