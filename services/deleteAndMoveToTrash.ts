export async function deleteAndMoveToTrash(query: object) {
    return fetch(
        "https://localhost:7109/deleteAndMoveToTrash",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        }
      );
    }