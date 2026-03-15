export default defineEventHandler(async (event) => {

    const query = await readBody(event);
  const token = getCookie(event, "access_token")

  
    return await $fetch(
      "http://localhost:5000/deleteAndMoveToTrash",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`

        },
        body: JSON.stringify(query),
      }
    );
  
  
  });
  