<script setup lang="ts">
const languageState = useLanguageState();

const changeLanguage = (lang: string) => {
  languageState.value = lang;
  localStorage.setItem('language', lang)
};
</script>

<template>
  <div class="inline-block gap-2 mr-2 mt-2">
    <img
      src="/flags/tr-flag.png"
      @click="changeLanguage('tr')"
      class="image"
    />
    <img
      src="/flags/am-flag.png"
      @click="changeLanguage('am')"
      class="image"
    />
    <img
      src="/flags/eng-flag.png"
      @click="changeLanguage('eng')"
      class="image"
    />
  </div>
</template>

<style scoped>

.image {
  @apply cursor-pointer rounded-[50%] w-9 h-9 inline;
}

.dark .image:hover {
  box-shadow: 0 0 10px white;
}

.light .image:hover {
  box-shadow: 0 0 10px black;
}
</style>
