export default defineEventHandler(async (event) => {

    const token = event.headers.get("token")
    if (!token) return;
  
    return await $fetch(
      "http://localhost:5000/keyboardGame",
      {
        method: "GET",
        headers: {
          "enc": token,
        },
      }
    );
  
  
  });
  