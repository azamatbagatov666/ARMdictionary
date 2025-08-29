<script setup lang="ts">
import type { TDATA } from "~/models/TDATA";
import { useSearchHistoryStore } from "~/store/search-history.store";

const loading = ref(true);

onMounted(() => {
    loading.value = false;
});

useHead({
  title: "Ermenice Sözlük",
});

const desword = ref("");
const previousDesword = ref("");
const thereIsNoResult = ref(false);
const thereIsNoConnection = ref(false);
const searchline = ref();
const alpTable = ref();
const searchHistoryStore = useSearchHistoryStore();

const { $bus } = useNuxtApp();

$bus.on("clear-main-page", () => {
  thereIsNoResult.value = false;
  thereIsNoConnection.value = false;
  responseData.value = null;
  previousDesword.value = "";
  desword.value = "";
  if (alpTable.value) {
    alpTable.value.closePanel();
  }
});

const setToday = async (todayData: TDATA[]) => {
  responseData.value = todayData;
  desword.value = todayData[0].aranan!;
  previousDesword.value = desword.value;
  searchHistoryStore.addHistory(desword.value);
  thereIsNoResult.value = false;
  thereIsNoConnection.value = false;
  searchline.value.wordFromAbove(desword.value);
};

const wordInput = (data: string) => {
  desword.value = data;
};

const responseData = ref();
const submit = async () => {
  if (desword.value == "" || desword.value == previousDesword.value) {
    return;
  }

  const { data, error } = await useFetch(
    `/api/search/${encodeURI(desword.value)}`,
    {
      method: "GET",
    }
  );
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
    method: "GET",
  });

  if (error.value) {
    thereIsNoConnection.value = true;
    thereIsNoResult.value = false;

    return;
  }
  responseData.value = null;

  if (data) {
    responseData.value = data.value;
    desword.value = responseData.value[0].aranan;
    thereIsNoResult.value = false;
    thereIsNoConnection.value = false;
    previousDesword.value = desword.value;
    searchline.value.wordFromAbove(desword.value);
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
  <div>
    <div class="h-[90vh] flex items-center justify-center" v-if="loading">
      <ElementComponentsLoadingAnimation />
    </div>

    <div v-else class="containers">
      <ElementComponentsLogoBanner />

      <div class="flex justify-center w-full">
        <div class="w-full">
          <SearchLine
            @input-changed="wordInput"
            @submit-request="submit"
            @random-request="random"
            @set-today="setToday"
            ref="searchline"
          ></SearchLine>
        </div>
      </div>

      <AlpTable ref="alpTable" />

      <wordTable :responseData="responseData"></wordTable>

      <div
        v-if="thereIsNoResult"
        class="text-lg text-center mt-4 text-white font-bold"
        v-text="$t('index.noResult')"
      ></div>
      <div
        v-if="thereIsNoConnection"
        class="text-lg text-center mt-4 text-white font-bold"
        v-text="$t('index.noConnection')"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.containers {
  /*
  width: 99vw;
  align-items: center;
  justify-content: center;
  */
}
</style>
