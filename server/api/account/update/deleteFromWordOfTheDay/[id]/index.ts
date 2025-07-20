export default defineEventHandler(async (event) => {

  const date = event.context.params?.id;

  const formattedSelectedDate = () => {
    if (date != null) {
      const parts = date.split("%2F");
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  };




  const token = event.headers.get("token")
  if (!token) return;

  

  return await $fetch(
    "http://localhost:5000/DeleteFromWordOfTheDay",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(formattedSelectedDate()),
    }
  );


});
