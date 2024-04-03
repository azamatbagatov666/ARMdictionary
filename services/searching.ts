import { type TDATA } from "~/models/TDATA";

export const searching = async (query: string) => {
  query = encodeURIComponent(query)
    return useFetch<TDATA[]>(
        `https://localhost:7109/searching/${query}`
      );
}