import type { AuthenticateResponse } from "~/models/AuthenticateResponse";
 

export function useAuth() {
  const router = useRouter();
  const session = useState<boolean>("session", () => false)



  const user = useState<AuthenticateResponse | null>("user", () => null);

  const isLogged = () => user.value !== null;

  const login = async (username: string, password: string) => {
  try {
      const res = await $fetch<AuthenticateResponse>(
        "/api/account/user/login",
        {
          method: "POST",
          body: { username, password },
        }
      );

      session.value = true        
      await router.push("/");
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await $fetch("/api/account/user/logout", { method: "POST" });
    } finally {
      session.value = false       // 🔥 reactive update

      await router.push("/");
    }
  };

  return {
    user,
    session,
    isLogged,
    login,
    logout,
  }
}