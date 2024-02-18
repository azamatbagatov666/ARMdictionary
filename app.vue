<script setup lang="ts">
const languageState = useLanguageState();


const cleaningState = useCleaningState();

const handleCleaningTime = () => {
  cleaningState.value = true;
};

onMounted(() => {
  const language = localStorage.getItem("language");
  if (language) languageState.value = language;
});
</script>

<template>
  <div
    class="bg-gray-200 h-12 grid grid-cols-2 dark:bg-black transition-color duration-300"
  >
    <NavBarNavMenu @cleaning-time="handleCleaningTime" />
    <div class="justify-end items-center flex gap-2">
      <NavBarToggleSwitch />
      <NavBarLanguageOption />
    </div>
  </div>

  <NuxtPage></NuxtPage>
</template>
