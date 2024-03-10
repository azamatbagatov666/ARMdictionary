export const testLoginRequest = async (token: string): Promise<boolean> => {
    return await $fetch<boolean>("https://localhost:7109/Authentication/TestLogin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
    });
};
