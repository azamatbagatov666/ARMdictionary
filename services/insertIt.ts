export const insertIt = async (token: string, query: object) => {
     return fetch("https://localhost:7109/InsertIt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token

      },
      body: JSON.stringify(query),
    })
  }