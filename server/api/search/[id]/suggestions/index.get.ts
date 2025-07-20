export default defineEventHandler(async event => {
  const id = event.context.params?.id;
  
  
  return $fetch<string[]>(
    `http://localhost:5000/gettingSuggestions/${id}`
  ); 
} 


);