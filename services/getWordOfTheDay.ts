import { type WORDOFTHEDAY } from "~/models/WORDOFTHEDAY";

export const gettingWordOfTheDay = async (token: string, start: string, end: string) => {
    return useFetch<WORDOFTHEDAY[]>
    (
        `https://localhost:7109/GetWordOfTheDay?START=${start}&END=${end}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },

        }
      );
}
