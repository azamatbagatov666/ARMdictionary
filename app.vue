<script setup lang="ts">
import { useSearchHistoryStore } from './store/search-history.store';
import { useUserStore } from './store/user.store';

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
<!--- 
-->

<div>
<NavBarNavMenu class="hidden md:flex"/>

<NavBarMobileNavMenu/>
</div>


  <NuxtPage></NuxtPage>
</template>
