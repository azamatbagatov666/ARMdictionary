<script setup lang="ts">
import { useSearchHistoryStore } from "~/store/search-history.store";

const { t } = useI18n();


const searchHistoryStore = useSearchHistoryStore();

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
        class="inline-block mr-2"
      >
        <span
          class="hover:underline hover:cursor-pointer  hover:bg-white dark:hover:bg-gray-500"
          v-text="item"
        ></span
        ><span class="ml-2" v-if="index < historyList.length - 1" v-text="'/'"></span>
      </li>
      <span class="text-center w-full inline-block" v-else
        >Arama geçmişinde hiç sözcük yok</span
      >
    </ul>
    <button
      v-if="historyList.length > 0"
      @click="remove"
      @mousedown="buttonClick"
      class="bg-white border select-none border-black text-black font-bold px-4 h-8 rounded-md flex items-center mx-auto transition-colors duration-300 active:scale-95 active:bg-red-500"
    >
                <svg
            fill="#000000"
            width="22px"
            height="22px"
            viewBox="0 0 32 32"
            version="1.1"
          >
            <path d="M30 7.249h-5.598l-3.777-5.665c-0.137-0.202-0.366-0.334-0.625-0.334h-8c-0 0-0.001 0-0.001 0-0.259 0-0.487 0.131-0.621 0.331l-0.002 0.003-3.777 5.665h-5.599c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h3.315l1.938 21.319c0.036 0.384 0.356 0.682 0.747 0.682 0 0 0 0 0.001 0h16c0 0 0.001 0 0.001 0 0.39 0 0.71-0.298 0.745-0.679l0-0.003 1.938-21.319h3.316c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0zM12.401 2.75h7.196l2.999 4.499h-13.195zM23.314 29.25h-14.63l-1.863-20.5 18.358-0.001zM11 11.25c-0.414 0-0.75 0.336-0.75 0.75v0 14c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-14c-0-0.414-0.336-0.75-0.75-0.75v0zM16 11.25c-0.414 0-0.75 0.336-0.75 0.75v0 14c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-14c-0-0.414-0.336-0.75-0.75-0.75v0zM21 11.25c-0.414 0-0.75 0.336-0.75 0.75v0 14c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-14c-0-0.414-0.336-0.75-0.75-0.75v0z"></path>
          </svg>
      
      <span class="ml-2"
        v-text="t('searchHistory.removeButton')"
      ></span>
    </button>
  </div>
</template>

<style scoped>

@media (hover: hover) and (pointer: fine) {
  .border:hover {
@apply bg-red-500;

  }



}

</style>
