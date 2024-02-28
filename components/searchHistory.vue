<script setup lang="ts">
import { ref, onMounted } from "vue";

const { theHistory, addHistory, removeHistory } = searchHistory();
const historyS = ref(theHistory);
const languageState = useLanguageState();


const removeButton = computed(() => {
  switch (languageState.value) {
    case "eng":
      return "Clear History";
    case "am":
      return "";
    case "tr":
      return "Geçmişi Temizle";
    default:
      return "Geçmişi Temizle";
  }
});

const emit = defineEmits<{
  (e: "history-selected", data: string): void;
}>();



const remove = () => {
  removeHistory();
  historyS.value = [];
  
};

const historySelected = (item: string) => {
  emit("history-selected", item);

  
};
</script>

<template>
<div class=" border-black w-[600px] pb-1 bg-gray-200 dark:border-white dark:bg-[#101010] transition-colors duration-300">
  <ul class="p-2">
<li v-for="(item, index) in historyS" v-text="item" @click="historySelected(item)" class="inline-block mr-3 hover:underline hover:cursor-pointer hover:bg-white dark:hover:bg-gray-500"></li>
  </ul>
  <ElementComponentsCustomButton @click = "remove" class="px-1 h-6 rounded-md flex items-center mx-auto" :text="removeButton"/>

</div>


</template>

<style scoped>
  /* Add your styles here */
</style>
