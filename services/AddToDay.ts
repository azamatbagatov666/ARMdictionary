export const AddToDay = async (token: string, query: object) => {
  console.log(JSON.stringify(query))
    return fetch("https://localhost:7109/AddToDay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token

        },
        body: JSON.stringify(query),
      })}