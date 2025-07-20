export default defineEventHandler(async (event) => {
  const token = event.headers.get("token")
  if (!token) return;

  return await $fetch<boolean>("http://localhost:5000/Authentication/TestLogin", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
  });
});
