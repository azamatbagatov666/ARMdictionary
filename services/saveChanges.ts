export async function saveChanges(token: string, query: object) {
    return fetch("https://localhost:7109/updateResult", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "Authorization": token
     },
     body: JSON.stringify(query),
   })
 }