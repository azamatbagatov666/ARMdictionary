import type { AuthenticateResponse } from "~/models/AuthenticateResponse";
import { testLoginRequest } from "~/services/testLogin";

interface UserState {
  user: AuthenticateResponse | undefined;
}

export const useUserStore = defineStore("user", () => {
  const state = reactive<UserState>({
    user: undefined,
  });

  const login = async (username: string, password: string) => {
    //const response = await loginRequest(username, password);
    
    const response = await $fetch('/api/account/user/login', {
      method: "POST",
      body: {
        username: username,
        password: password
      }
    })
    state.user = response;
    saveToLocalStorage();
    return isLogged();
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

  const logout = () => {

    localStorage.removeItem('user');
    state.user = undefined;
    
  }

  return {
    state,
    login,
    saveToLocalStorage,
    reLoginFromLocalStorage,
    isLogged,
    testLogin,
    logout
  };
});
