export async function searchingById(query: number) {
    return useFetch(
        `https://localhost:7109/searchingbyid/${query}`
      ); 
} 