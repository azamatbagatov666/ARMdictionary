<script lang="ts" setup>

const languageStore = useLanguageState()

const savedLanguage = localStorage.getItem('language')
if (savedLanguage) {
languageStore.value = savedLanguage
}

</script>

<template>

<div class="flex justify-left 2xl:absolute">
      <img src="/goryun.png" class="size-24 sm:size-28" draggable="false"/>
      <img v-if="languageStore == 'am'" src="/avedikyan_am.png" class="h-24 sm:h-28" draggable="false"/>
      <img v-else src="/avedikyan_tr.png" class="h-24 sm:h-28" draggable="false"/>
    </div>
</template>

<style scoped></style>