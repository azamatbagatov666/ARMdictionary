<script setup lang="ts">
import { searching } from "../services/searching";
import { getTodaysWord } from "../services/getTodaysWord";
import { getARandomWord } from "~/services/getARandomWord";
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
const searchline = ref();

const searchHistoryStore = useSearchHistoryStore()

const { $bus } = useNuxtApp();

$bus.on("clear-main-page", () => {
  thereIsNoResult.value = false;
  thereIsNoConnection.value = false;
  responseData.value = null;
  previousDesword.value = "";
  desword.value = "";
});


const todayData = ref();

onBeforeMount(async () => {
  getToday();

});

const getToday = async () => {
  try {
    const data = await getTodaysWord();

    if (
    data &&
    Array.isArray(data) &&
    data[0].aranan !== "NotFound"
  ) {
      todayData.value = data;
    }
  } catch (error) {
  }
};

const setToday = async () => {
  responseData.value = todayData.value;
  desword.value = todayData.value[0].aranan;
  previousDesword.value = desword.value
  searchHistoryStore.addHistory(desword.value);
  thereIsNoResult.value = false;
  thereIsNoConnection.value = false;
  //$bus.emit('desword-updated', desword.value);
  console.log(searchline);
  searchline.value.refer(desword.value)



};

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
        noResult: 'Aradığınız sözcük bulunamadı.',
      };
    default:
      return {
        noConnection: 'Bağlantı sorunu.',
        noResult: 'Aradığınız sözcük bulunamadı.',
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

const buttonClick = (event: Event) => {
  event.preventDefault();
};
</script>

<template>
  <div class="containers">
    <div class="flex justify-center">
    <div>
        <SearchLine
      @input-changed="wordInput"
      @submit-request="submit"
      @random-request="random"
      :desword="propdesword"
      ref="searchline"
    ></SearchLine>

      <button v-if="todayData"
        class="group bg-gray-200 rounded-b-md border-2 border-t-0 border-black h-12 w-12  place-items-center duration-300 dark:border-white dark:bg-[#101010] hover:!bg-red-600 hover:!w-40 origin-top-left active:scale-105"
        @click="setToday"
        @mousedown="buttonClick"
      >
      <div class="flex items-center ml-[5px]">
        <div class="rounded-full size-9 bg-red-600">
          <img src="/day.png" class="size-9" />
        </div>
        <div class="w-0">
        <span class="w-[112px] pointer-events-none inline-block opacity-0 leading-none group-hover:opacity-100 transition-opacity text-white group-hover:delay-300" v-text="'Günün Sözcüğü'"></span>
      </div>
      </div>
      </button> 
    </div>
</div>





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