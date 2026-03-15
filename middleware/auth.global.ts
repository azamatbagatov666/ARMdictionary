export default defineNuxtRouteMiddleware((to) => {
  const session = useCookie("session");

  const path = to.path.replace(/\/$/, "");

  if (!session.value && path.startsWith("/account/")) {
    return navigateTo("/");
  }

  if (session.value && path === "/account") {
    return navigateTo("/");
  }
});