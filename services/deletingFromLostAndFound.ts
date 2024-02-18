export async function deletingFromLostAndFound(query: object) {
    return fetch(
        "https://localhost:7109/DeletingFromLostAndFound",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        }
      );
}


