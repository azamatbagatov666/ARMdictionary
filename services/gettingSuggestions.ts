export async function gettingSuggestions(query: string) {
    return useFetch<string[]>(
        `https://localhost:7109/gettingSuggestions/${query}`
      ); 
} 


