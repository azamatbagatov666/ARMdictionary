<script setup lang="ts">
import { useSearchHistoryStore } from "~/store/search-history.store";

const searchHistoryStore = useSearchHistoryStore();
const languageState = useLanguageState();

const emit = defineEmits<{
  (e: "history-selected", data: string): void;
}>();

const buttonClick = (event: Event) => {
  event.preventDefault();
};

const remove = () => {
  searchHistoryStore.removeHistory();
};

const randomWordTimeout = ref(false);

const historySelected = (item: string) => {
  if (!randomWordTimeout.value) {
    emit("history-selected", item);
    randomWordTimeout.value = true;

    setTimeout(() => {
      randomWordTimeout.value = false;
    }, 500);
  }
};

const historyList = computed(() => searchHistoryStore.state.history);
</script>

<template>
  <div
    class="border-black lg:w-[600px] bg-gray-200 dark:border-white dark:bg-[#101010] transition-colors duration-300 w-full"
  >
    <ul class="p-2 w-full">
      <li
        v-if="historyList.length > 0"
        v-for="(item, index) in historyList"
        @click="historySelected(item)"
        class="inline mr-2"
      >
        <span
          class="hover:underline hover:cursor-pointer  hover:bg-white dark:hover:bg-gray-500"
          v-text="item"
        ></span
        ><span v-if="index < historyList.length - 1" v-text="' /'"></span>
      </li>
      <span class="text-center w-full inline-block" v-else
        >Arama geçmişinde hiç sözcük yok</span
      >
    </ul>
    <button
      v-if="historyList.length > 0"
      @click="remove"
      @mousedown="buttonClick"
      class="bg-white border border-black text-black font-bold px-4 h-8 rounded-md flex items-center mx-auto transition-colors duration-300 active:scale-95 hover:bg-red-500"
    >
      <img src="/trash.png" class="size-9" draggable="false" /><span
        v-text="$t('searchHistory.removeButton')"
      ></span>
    </button>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
