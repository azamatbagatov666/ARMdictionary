import { type TDATA } from "~/models/TDATA";


export const searchingnocheck = async (token: string, query: string) => {

  query = encodeURIComponent(query)

    return useFetch<TDATA[]>(
        `https://localhost:7109/searchingnocheck/${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          }
        }
      );
}