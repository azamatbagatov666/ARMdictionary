import { type LOSTANDFOUND } from "~/models/LOSTANDFOUND";

export async function gettingSearchedOnes(token: string) {
    return $fetch<LOSTANDFOUND[]>
    (
        `https://localhost:7109/gettingSearchedOnes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
        }
      );
}
