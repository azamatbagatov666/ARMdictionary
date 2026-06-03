
export default defineEventHandler(async event => {
    return await $fetch<string[]>(
        `http://localhost:5000/getWordleList`
      );
});