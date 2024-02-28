<script setup lang="ts">
const languageState = useLanguageState();

onMounted(() => {
  const language = localStorage.getItem("language");
  if (language) languageState.value = language;
});
</script>

<template>
  <div
    class="bg-gray-200 h-12 flex justify-between dark:bg-black transition-colors duration-300"
  >
    <NavBarNavMenu/>
    
    <div class="justify-end items-center flex gap-2">
      <NavBarToggleSwitch />
      <NavBarLanguageOption />
    </div>
  </div>

  <NuxtPage></NuxtPage>
</template>
