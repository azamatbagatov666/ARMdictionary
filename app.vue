<script setup lang="ts">
const languageState = useLanguageState();

onMounted(() => {
  const language = localStorage.getItem("language");
  if (language) languageState.value = language;
});
</script>
<template>
  <div class="bg-black">
    <ToggleSwitch></ToggleSwitch>
    <LanguageOption></LanguageOption>
  </div>

  <NuxtPage></NuxtPage>
</template>
