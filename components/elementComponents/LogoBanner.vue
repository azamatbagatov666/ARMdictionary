<script lang="ts" setup>
const languageStore = useLanguageState();
const mounted = ref(false);

onMounted(() => {
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage) {
    languageStore.value = savedLanguage;
  }
  mounted.value = true;
});
</script>

<template>
  <div v-if="mounted" class="flex justify-left 2xl:absolute">
    <img
      src="/goryun.png"
      alt="Ermeni Güneş Haçı"
      class="size-24 sm:size-28"
      draggable="false"
    />

    <img
      v-if="languageStore === 'am'"
      src="/avedikyan_am.png"
      alt="Avedikyan Ermenice logo"
      class="h-24 sm:h-28"
      draggable="false"
    />

    <img
      v-else
      src="/avedikyan_tr.png"
      alt="Avedikyan Türkçe Logo"
      class="h-24 sm:h-28"
      draggable="false"
    />
  </div>
</template>

<style scoped></style>