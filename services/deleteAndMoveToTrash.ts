export const deleteAndMoveToTrash = async (token: string, query: object) => {
    return fetch(
        "https://localhost:7109/deleteAndMoveToTrash",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify(query),
        }
      );
    }