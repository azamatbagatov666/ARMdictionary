<script setup lang="ts">
import { type TDATA } from "~/models/TDATA";

useHead({
  title:'Ermenice Sözlük'
})

const desword = ref("");
const previousDesword = ref("");
const thereIsNoResult = ref(false);
const thereIsNoConnection = ref(false);
const languageState = useLanguageState();

const noResult = computed(() => {
  switch (languageState.value) {
    case "eng":
      return "The word you searched for was not found.";
    case "am":
      return "Չկրցաւ գտնուիլ ձեր փնտրած բառը։";
    case "tr":
      return "Aradığınız kelime bulunamadı.";
    default:
      return "Aradığınız kelime bulunamadı.";
  }
});

const noConnection = computed(() => {
  switch (languageState.value) {
    case "eng":
      return "Connection problem.";
    case "am":
      return "Կապակցութեան հարց։";
    case "tr":
      return "Bağlantı sorunu.";
    default:
      return "Bağlantı sorunu.";
  }
});



const wordInput = (data: string) => {
  desword.value = data;
};

const responseData = ref();
const submit = async () => {
  if (desword.value == "" || desword.value == previousDesword.value) {
    return;
  }
  const { data, error } = await useFetch<TDATA[]>(
    `https://localhost:7109/searching/${desword.value}`
  );
  if (error.value) {
    thereIsNoConnection.value = true;
    thereIsNoResult.value = false;


    return;
  }
  responseData.value = null;
  previousDesword.value = desword.value;

  if (data && Array.isArray(data.value) && data.value.length > 0 && data.value[0].aranan !== "NotFound") {
    responseData.value = data.value;
    thereIsNoResult.value = false;
    thereIsNoConnection.value = false;
  } else {
    thereIsNoResult.value = true;
  }
};
</script>

<template>


<div class="containers">


    <SearchLine
      @input-changed="wordInput"
      @submit-request="submit"
    ></SearchLine>


  <wordTable :responseData="responseData"></wordTable>

  <div v-if="thereIsNoResult" class="text-lg text-center mt-4" v-text="noResult"></div>
  <div v-if="thereIsNoConnection" class="text-lg text-center mt-4" v-text="noConnection"></div>

</div>


</template>

<style>
.containers {
  padding-left: calc(100vw - 100%);
}
</style>
