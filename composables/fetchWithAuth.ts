export async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    const refresh = await fetch("/api/account/user/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refresh.ok) {
      throw new Error("Unauthorized");
    }

    // retry
    res = await fetch(url, {
      ...options,
      credentials: "include",
    });
  }

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
