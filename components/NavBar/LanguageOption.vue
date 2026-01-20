<script setup lang="ts">
const languageState = useLanguageState();
const { locale, setLocale } = useI18n();

const changeLanguage = async (lang: string) => {
  await setLocale(lang);
  languageState.value = lang;
  localStorage.setItem("language", lang);
};
</script>

<template>
  <div class="inline-block mr-2 shrink ">
    <button class="langButton" @click="changeLanguage('tr')" aria-label="Sayfa Dili Türkçe">
      <img src="/flags/tr-flag.png" alt="" class="image" draggable="false" />
    </button>
    <button class="langButton" @click="changeLanguage('am')" aria-label="Sayfa Dili Ermenice">
      <img src="/flags/am-flag.png" alt="" class="image" draggable="false" />
    </button>

    <button class="langButton" @click="changeLanguage('en')" aria-label="Sayfa Dili İngilizce">
      <img src="/flags/eng-flag.png" alt="" class="image" draggable="false" />
    </button>
  </div>
</template>

<style scoped>
img,
.langButton {
  @apply mr-1 cursor-pointer rounded-[50%] w-9 h-9 inline;
}

.langButton:active {
  @apply shadow-[0_0_10px_gray] dark:!shadow-[0_0_10px_white];
}

@media (hover: hover) and (pointer: fine) {
  .langButton:hover {
    @apply shadow-[0_0_10px_gray] dark:!shadow-[0_0_10px_white];
  }
}
</style>
