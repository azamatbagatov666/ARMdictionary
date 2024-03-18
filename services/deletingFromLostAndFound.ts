export async function deletingFromLostAndFound(token: string, query: object) {
    return fetch(
        "https://localhost:7109/DeletingFromLostAndFound",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify(query),
        }
      );
}


