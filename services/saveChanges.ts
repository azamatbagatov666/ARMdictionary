export async function saveChanges(query: object) {
    return fetch("https://localhost:7109/updateResult", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(query),
   })
 }