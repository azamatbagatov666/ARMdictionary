import { type TDATA } from "~/models/TDATA";


export const getARandomWord = async () => {

    return useFetch<TDATA[]>(
        `https://localhost:7109/getRandom`
      );
}