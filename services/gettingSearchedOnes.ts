import { type LOSTANDFOUND } from "~/models/LOSTANDFOUND";

export async function gettingSearchedOnes() {
    return $fetch<LOSTANDFOUND[]>
    (
        `https://localhost:7109/gettingSearchedOnes`
      );
}
