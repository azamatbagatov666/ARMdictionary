export function useFetchWithAuth<T>(
  url: string,
  options: any = {}
) {
  return useFetch<T>(url, {
    ...options,
    credentials: "include",
    onResponseError: async ({ response }) => {
      if (response.status === 401) {
        const refresh = await $fetch("/api/account/user/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!refresh) {
          throw createError({ statusCode: 401 });
        }
      }
    },
  });
}
