<script setup lang="ts">
import { useSearchHistoryStore } from "~/store/search-history.store";




useHead({
  title: "Ermenice Sözlük",
});

const desword = ref("");
const previousDesword = ref("");
const thereIsNoResult = ref(false);
const thereIsNoConnection = ref(false);
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

    const  data = await $fetch(`/api/get/getTodaysWord`, {
    method: 'GET'
  })
    if (
    data &&
    Array.isArray(data) &&
    data[0].aranan !== "NotFound"
  ) {
      todayData.value = data;
    }
    else{
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
  searchline.value.wordFromAbove(desword.value)



};


const wordInput = (data: string) => {
  desword.value = data;
};



const responseData = ref();
const submit = async () => {
  if (desword.value == "" || desword.value == previousDesword.value) {
    return;
  }

  const { data, error } = await useFetch(`/api/search/${(encodeURI(desword.value))}`,
  {
    method: 'GET'  
  })
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


  const { data, error } = await useFetch(`/api/get/getARandomWord`, {
    method: 'GET'
  })

  
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
    searchline.value.wordFromAbove(desword.value)
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
      ref="searchline"
      :cornered="!todayData"
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
      v-text="$t('index.noResult')"
    ></div>
    <div
      v-if="thereIsNoConnection"
      class="text-lg text-center mt-4"
      v-text="$t('index.noConnection')"
    ></div>
  </div>

</template>

<style>
.containers {
  padding-left: calc(100vw - 100%);
}
</style>