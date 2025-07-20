export default defineEventHandler(async (event) => {

  const query = await readBody(event);
  const token = event.headers.get("token")
  if (!token) return;

  return await $fetch(
    "http://localhost:5000/DeletingFromLostAndFound",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(query),
    }
  );


});
