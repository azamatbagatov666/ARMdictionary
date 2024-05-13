export default defineEventHandler(async (event) => {
  const token = event.headers.get("token")
  if (!token) return;

  return await $fetch<boolean>("https://localhost:7109/Authentication/TestLogin", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
  });
});
