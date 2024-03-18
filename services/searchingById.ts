import { type TDATA } from "~/models/TDATA";


export async function searchingById(token: string, query: number) {
    return useFetch<TDATA[]>(
        `https://localhost:7109/searchingbyid/${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          }
        }
      ); 
} 