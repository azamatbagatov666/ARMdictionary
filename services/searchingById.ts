import { type TDATA } from "~/models/TDATA";


export async function searchingById(query: number) {
    return useFetch<TDATA[]>(
        `https://localhost:7109/searchingbyid/${query}`
      ); 
} 