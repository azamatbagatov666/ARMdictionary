import type { AuthenticateResponse } from "~/models/AuthenticateResponse";
import { loginRequest } from "~/services/login";
import { testLoginRequest } from "~/services/testLogin";

interface UserState {
  user: AuthenticateResponse | undefined;
}

export const useUserStore = defineStore("user", () => {
  const state = reactive<UserState>({
    user: undefined,
  });

  const login = async (username: string, password: string) => {
    const response = await loginRequest(username, password);
    state.user = response;
    saveToLocalStorage();
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("user", JSON.stringify(state.user));
  };

  const reLoginFromLocalStorage = () => {
    const user = localStorage.getItem("user");
    if (user) state.user = JSON.parse(user);
  };

  const isLogged = (): boolean => {
    return state.user !== undefined;
  };

  const testLogin = async (): Promise<boolean> => {
    if (isLogged()) {
        return await testLoginRequest(state.user!.token)
    }
    return false;
  }

  return {
    state,
    login,
    saveToLocalStorage,
    reLoginFromLocalStorage,
    isLogged,
    testLogin
  };
});