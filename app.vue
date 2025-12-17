<script setup lang="ts">
import { useSearchHistoryStore } from './store/search-history.store';
import { useUserStore } from './store/user.store';

useHead({
  link: [
    { rel: "manifest", href: "/manifest.json" },
    { rel: "icon", href: "/icon-192.png" },

    // iOS special requirement:
    { rel: "apple-touch-icon", href: "/icon-192.png" }
  ],
  meta: [
    { name: "theme-color", content: "#ffffff" },
    { name: "apple-mobile-web-app-capable", content: "yes" }
  ]
});


const languageState = useLanguageState();
const searchHistoryStore = useSearchHistoryStore()
const userStore = useUserStore();

const { setLocale } = useI18n();

onMounted(async () => {
  const language = localStorage.getItem("language");
  if (language) setLocale(language);
  searchHistoryStore.readInitial();
  userStore.reLoginFromLocalStorage();
});
</script>

<template>


<div>
<NavBarNavMenu class="hidden lg:flex"/>

<NavBarMobileNavMenu/>
</div>


  <NuxtPage></NuxtPage>
</template>
