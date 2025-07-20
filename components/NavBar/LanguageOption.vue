<script setup lang="ts">
const languageState = useLanguageState();
const { locale, setLocale } = useI18n()

const changeLanguage = async (lang: string) => {
  await setLocale(lang)
  languageState.value = lang;
  localStorage.setItem('language', lang)
};
</script>

<template>
  <div class="inline-block mr-2 shrink-0">
    <img
      src="/flags/tr-flag.png"
      @click="changeLanguage('tr')"
      class="image" draggable="false"
    />
    <img
      src="/flags/am-flag.png"
      @click="changeLanguage('am')"
      class="image" draggable="false"
    />
    <img
      src="/flags/eng-flag.png"
      @click="changeLanguage('en')"
      class="image" draggable="false"
    />
  </div>
</template>

<style scoped>

.image {
  @apply mr-1 cursor-pointer rounded-[50%] w-9 h-9 inline;
}

.image:hover {
  @apply shadow-[0_0_10px_gray] dark:!shadow-[0_0_10px_white];
}



</style>
