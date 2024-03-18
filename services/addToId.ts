export async function addToId(token: string, query: object) {
    return       fetch("https://localhost:7109/AddToID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token

        },
        body: JSON.stringify(query),
      })}