export async function insertIt(query: object) {
     return fetch("https://localhost:7109/InsertIt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    })
  }