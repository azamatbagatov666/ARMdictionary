export default defineEventHandler(async event => {
  const id = event.context.params?.id;
  
  
  return $fetch<string[]>(
    `https://localhost:7109/gettingSuggestions/${id}`
  ); 
} 


);