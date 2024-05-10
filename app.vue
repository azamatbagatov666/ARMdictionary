<script setup lang="ts">
import { useSearchHistoryStore } from './store/search-history.store';
import { useUserStore } from './store/user.store';

const languageState = useLanguageState();
const searchHistoryStore = useSearchHistoryStore()
const userStore = useUserStore();

onMounted(async () => {
  const language = localStorage.getItem("language");
  if (language) languageState.value = language;
  searchHistoryStore.readInitial();
  userStore.reLoginFromLocalStorage();
});
</script>

<template>

  <div
    class="sticky top-0 z-[55] bg-gray-200 h-12 flex justify-between dark:bg-black transition-colors duration-300 w-full"
  >
    <NavBarNavMenu/>
    <div class="justify-end items-center flex gap-2">
      <NavBarToggleSwitch />
      <NavBarLanguageOption />
    </div>
  </div>


  <NuxtPage></NuxtPage>
</template>
