export const gettingSuggestions = async (query: string) => {
  query = encodeURIComponent(query)

    return useFetch<string[]>(
        `https://localhost:7109/gettingSuggestions/${query}`
      ); 
} 