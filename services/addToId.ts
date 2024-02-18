export async function addToId(query: object) {
    return       fetch("https://localhost:7109/AddToID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      })}