<script setup lang="ts">
import { searching } from "../services/searching";
import { getARandomWord } from "../services/getARandomWord";
import { useSearchHistoryStore } from "~/store/search-history.store";


useHead({
  title: "Ermenice Sözlük",
});

const desword = ref("");
const propdesword = ref("");
const previousDesword = ref("");
const thereIsNoResult = ref(false);
const thereIsNoConnection = ref(false);
const languageState = useLanguageState();


const searchHistoryStore = useSearchHistoryStore()

const { $bus } = useNuxtApp();

$bus.on("clear-main-page", () => {
  thereIsNoResult.value = false;
  thereIsNoConnection.value = false;
  responseData.value = null;
  previousDesword.value = "";
  desword.value = "";
});


const indexLanguage = computed(() => {
  switch (languageState.value) {
    case "eng":
      return {
        noConnection: 'Connection problem.',
        noResult: 'The word you searched for was not found.',
      };
    case "am":
      return {
        noConnection: "Կապակցութեան հարց։",
        noResult: 'Չկրցաւ գտնուիլ ձեր փնտրած բառը։',
      };
    case "tr":
      return {
        noConnection: 'Bağlantı sorunu.',
        noResult: 'Aradığınız kelime bulunamadı.',
      };
    default:
      return {
        noConnection: 'Bağlantı sorunu.',
        noResult: 'Aradığınız kelime bulunamadı.',
      };
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
console.log(desword.value)

  const { data, error } = await searching(desword.value);
  if (error.value) {
    thereIsNoConnection.value = true;
    thereIsNoResult.value = false;

    return;
  }
  responseData.value = null;
  previousDesword.value = desword.value;


  if (
    data &&
    Array.isArray(data.value) &&
    data.value.length > 0 &&
    data.value[0].aranan !== "NotFound"
  ) {
    responseData.value = data.value;
    thereIsNoResult.value = false;
    thereIsNoConnection.value = false;
    searchHistoryStore.addHistory(desword.value);

  } else {
    thereIsNoResult.value = true;
  }
};

const random = async () => {

  const { data, error } = await getARandomWord();
  if (error.value) {
    thereIsNoConnection.value = true;
    thereIsNoResult.value = false;

    return;
  }
  responseData.value = null;

  if (
    data
  ) {
    responseData.value = data.value;
    desword.value = responseData.value[0].aranan
    thereIsNoResult.value = false;
    thereIsNoConnection.value = false;
    previousDesword.value = desword.value;
    propdesword.value = desword.value
    searchHistoryStore.addHistory(desword.value);

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
      @random-request="random"
      :desword="propdesword"
    ></SearchLine>



    <wordTable :responseData="responseData"></wordTable>

    <div
      v-if="thereIsNoResult"
      class="text-lg text-center mt-4"
      v-text="indexLanguage.noResult"
    ></div>
    <div
      v-if="thereIsNoConnection"
      class="text-lg text-center mt-4"
      v-text="indexLanguage.noConnection"
    ></div>
  </div>

</template>

<style>
.containers {
  padding-left: calc(100vw - 100%);
}
</style>
