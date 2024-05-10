import { type TDATA } from "~/models/TDATA";


export const searchingById = async (token: string, query: number) => {
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
