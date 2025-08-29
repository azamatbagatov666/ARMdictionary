import { type ARTICLES } from "~/models/ARTICLES";

export default defineEventHandler(async event => {
    return await $fetch<ARTICLES[]>(
        `http://localhost:5000/getArticles`
      );
});