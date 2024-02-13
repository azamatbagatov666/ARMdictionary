<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { gettingSuggestions } from "../services/gettingSuggestions";
const currentHoverIndex = ref<number>(-1);
const languageState = useLanguageState();
const desword = ref("");
const resultBoxContent = ref<string[]>([]);
const isResultBoxVisible = ref(false);
const search = ref<HTMLInputElement | null>(null);
const cursorStart = ref<number>(0);
const cursorEnd = ref<number>(0);

var listOfAvailableWords: string[];
listOfAvailableWords = [];

const lcandtrimmed = computed(() => {
  return desword.value.toLocaleLowerCase("tr-TR").trim();
});

const searching = computed(() => {
  switch (languageState.value) {
    case "eng":
      return "Search a word.";
    case "am":
      return "Փնտռցէք բառ մը:";
    case "tr":
      return "Bir sözcük ara.";
    default:
      return "Bir sözcük ara.";
  }
});

const keyboardButton = computed(() => {
  switch (languageState.value) {
    case "eng":
      return "Armenian Keyboard";
    case "am":
      return "Հայերէն Ստեղնաշար";
    case "tr":
      return "Ermenice Klavye";
    default:
      return "Ermenice Klavye";
  }
});

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
});

const handleDocumentClick = (event: MouseEvent) => {
  const keyboard = document.querySelector(".aKeyboard");

  if (keyboard) {
    if (!keyboard.contains(event.target as Node)) 
    isResultBoxVisible.value = false;
  }
  else
    isResultBoxVisible.value = false;
};

const emit = defineEmits<{
  (e: "input-changed", data: string): void;
  (e: "submit-request"): void;
}>();

const inputChanged = async () => {
  emit("input-changed", lcandtrimmed.value);
  let result: any[] = [];

  if (lcandtrimmed.value.length >= 3) {
    const { data, error } = await gettingSuggestions(lcandtrimmed.value); 
    if (error.value) {
      return;
    }

    if (data) listOfAvailableWords = [...(<[]>data.value)];

    result = listOfAvailableWords.filter((keyword) => {
      return keyword.toLowerCase().startsWith(lcandtrimmed.value);
    });

    currentHoverIndex.value = -1;

    isResultBoxVisible.value = result.length > 0;
  } else {
    isResultBoxVisible.value = false;
  }

  resultBoxContent.value = result;
};

const selectTheInput = async (item: string) => {
  desword.value = item;
  emit("input-changed", lcandtrimmed.value);
  emit("submit-request");
  isResultBoxVisible.value = false;
  await nextTick();
  search.value?.select();


};

const keyBase = (event: any) => {
  if (event.key == "ArrowDown") {
    keyDown();
    event.preventDefault();
  } else if (event.key == "ArrowUp") {
    keyUp();
    event.preventDefault();
  } else if (event.key == "Enter") keyEnter();
};

const keyDown = () => {
  if (currentHoverIndex.value < resultBoxContent.value.length - 1)
    currentHoverIndex.value++;
};

const keyUp = () => {
  if (currentHoverIndex.value >= 0) currentHoverIndex.value--;
};

const keyEnter = () => {
  if (currentHoverIndex.value == -1) {
    emit("submit-request");
    isResultBoxVisible.value = false;
  } else {
    desword.value = resultBoxContent.value[currentHoverIndex.value];
    emit("input-changed", lcandtrimmed.value);
    emit("submit-request");
    resultBoxContent.value = [];
    currentHoverIndex.value = -1;
  }
};

let keyboardOn = ref(false);

const toggleKeyboard = () => {
  keyboardOn.value = !keyboardOn.value;
};

const pushing = async (letter: string) => {
  if (document.activeElement !== search.value) {
    search.value?.focus();
  }


  if (search.value && search.value.selectionStart !== undefined) {
    //if (search.value.selectionStart)
      //@ts-ignore
      cursorStart.value = search.value.selectionStart;
    //if (search.value.selectionEnd)
      //@ts-ignore
      cursorEnd.value = search.value.selectionEnd;
    desword.value =
      desword.value.slice(0, cursorStart.value) +
      letter +
      desword.value.slice(cursorEnd.value);

    await nextTick();

    inputChanged();

    search.value.setSelectionRange(
      cursorStart.value + 1,
      cursorStart.value + 1
    );
  }
};

const backSpace = async () => {
  if (document.activeElement !== search.value) {
    search.value?.focus();
  }
  
  //@ts-ignore
  cursorStart.value = search.value.selectionStart;
  //@ts-ignore
  cursorEnd.value = search.value.selectionEnd;

  if (search.value)
  {
    if (cursorStart.value != cursorEnd.value) {
      desword.value =
      desword.value.slice(0, cursorStart.value) +
      desword.value.slice(cursorEnd.value);

      inputChanged();

      await nextTick();

      search.value.setSelectionRange(
      cursorStart.value,
      cursorStart.value);
    }
    else if (cursorStart.value != 0){
      desword.value =
      desword.value.slice(0, cursorStart.value - 1) +
      desword.value.slice(cursorStart.value);

      inputChanged();

      await nextTick();

      search.value.setSelectionRange(
      cursorStart.value -1,
      cursorStart.value -1);
    }
  }
};

const submit = () => {
  emit("submit-request");
};
</script>

<template>

  <div>
    <ArmenianKeyboard
      class="aKeyboard"
      v-if="keyboardOn"
      @letter-pushed="pushing"
      @backspace-clicked="backSpace"
    ></ArmenianKeyboard>
    <div class="h-[269px]" v-else></div>
  </div>
  
  
  
  <div class="flex justify-center">
<div class="bg-gray-200 p-6 border-2 border-black rounded-lg dark:bg-[#101010] dark:border-white">
  <ElementComponentsCustomButton class="block mx-auto border-b-0 rounded-t-lg rounded-b-none w-52 active:!bg-white active:!scale-100" :text="keyboardButton" @click="toggleKeyboard"/>
  <div class="searchbox">
    <div class="row">
      <input
        type="text"
        ref="search"
        v-model="desword"
        id="motherinput"
        :placeholder="searching"
        autocomplete="off"
        autofocus
        @input="inputChanged"
        @keydown="keyBase($event)"
      />

      <button @click="submit" class="motherbutton">
        <img src="/glass.png" width="35" height="35" />
      </button>
    </div>
  </div>
  <div class="resultBox dark:text-black" v-show="isResultBoxVisible">
      <ul>
        <li
          @click="selectTheInput(item)"
          v-for="(item, index) in resultBoxContent"
          v-text="item"
          :class="{ 'bg-[#e9f3ff]': index == currentHoverIndex }"
          @mouseover="currentHoverIndex = index"
        ></li>
      </ul>
    </div>
</div>

</div>




</template>

<style scoped>
#motherinput {
  flex: 1;
  height: 50px;
  background: transparent;
  border: 0;
  outline: 0;
  font-size: 18px;
  color: #333;
}

.motherbutton {
  cursor: pointer;
  width: 45px;
  size: 50px px;
  padding: 0;
  border: 0;
}

.motherbutton:hover {
  background-color: grey;
}

.row {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  --tw-border-opacity: 1;
  border-color: rgb(0 0 0 / var(--tw-border-opacity));
  border-width: 1px;
}

.searchbox {
  @apply sm:w-[300px] md:w-[450px] lg:w-[600px];
  background-color: white;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}

.resultBox {
  position: absolute;
  background-color: white;
  @apply w-full sm:w-[300px] md:w-[450px] lg:w-[600px];
  border-color: rgb(0 0 0 / var(--tw-border-opacity));
  border-width: 1px;
}

.resultBox ul {
  padding: 0px 10px;
}

.resultBox ul li {
  list-style: none;
  padding: 10px 12px;
  cursor: pointer;
}

.resultBox ul li.highlighted {
  background: #e9f3ff;
}
</style>
