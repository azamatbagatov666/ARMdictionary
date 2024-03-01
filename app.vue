<script setup lang="ts">
import { useSearchHistoryStore } from './store/search-history.store';

const languageState = useLanguageState();
const searchHistoryStore = useSearchHistoryStore()

onMounted(() => {
  const language = localStorage.getItem("language");
  if (language) languageState.value = language;
  searchHistoryStore.readInitial();
});
</script>

<template>
  <div
    class="sticky top-0 z-[55] bg-gray-200 h-12 flex justify-between dark:bg-black transition-colors duration-300"
  >
    <NavBarNavMenu/>
    
    <div class="justify-end items-center flex gap-2">
      <NavBarToggleSwitch />
      <NavBarLanguageOption />
    </div>
  </div>

  <NuxtPage></NuxtPage>
</template>
