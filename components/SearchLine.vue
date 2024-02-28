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

const { $bus } = useNuxtApp();


const props = defineProps(["desword"]);
watch(() => props.desword, (newVal) => {
  desword.value = newVal;
  nextTick(() => {
    search.value?.select();
  });
  
});


$bus.on("clear-main-page", () => {
  desword.value = "";
  keyboardOn.value = false;
  historyOn.value = false;
});

var listOfAvailableWords: string[];
listOfAvailableWords = [];

const lcandtrimmed = computed(() => {
  return desword.value.toLocaleLowerCase("tr-TR").trim();
});


const sLineLang = computed(() => {
  switch (languageState.value) {
    case "eng":
      return {
        searching: "Search a word.",
        keyboardButton: "Armenian Keyboard",
        historyButton: "Search History",
      };
    case "am":
      return {
        searching: "Փնտռցէք բառ մը:",
        keyboardButton: "Հայերէն Ստեղնաշար",
        historyButton: "Armenian",
      };
    case "tr":
      return {
        searching: "Bir sözcük ara.",
        keyboardButton: "Ermenice Klavye",
        historyButton: "Arama Geçmişi",
      };
    default:
      return {
        searching: "Bir sözcük ara.",
        keyboardButton: "Ermenice Klavye",
        historyButton: "Arama Geçmişi",
      };
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
  } else isResultBoxVisible.value = false;
};

const emit = defineEmits<{
  (e: "input-changed", data: string): void;
  (e: "submit-request"): void;
  (e: "random-request"): void;
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
  nextTick(() => {
    search.value?.select();
  });
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
  if (isResultBoxVisible.value && currentHoverIndex.value < resultBoxContent.value.length - 1)
    currentHoverIndex.value++;
};

const keyUp = () => {
  if (isResultBoxVisible.value && currentHoverIndex.value >= 0) currentHoverIndex.value--;
};

const keyEnter = () => {
  if (currentHoverIndex.value == -1) {
    emit("submit-request");
    search.value?.select();
    isResultBoxVisible.value = false;
  } else {
    desword.value = resultBoxContent.value[currentHoverIndex.value];
    emit("input-changed", lcandtrimmed.value);
    emit("submit-request");
    resultBoxContent.value = [];
    currentHoverIndex.value = -1;
    isResultBoxVisible.value = false;
    nextTick(() => {
      search.value?.select();
    });
  }
};


let historyOn = ref(false);

const toggleHistory = (event: Event) => {
  event.preventDefault();

  historyOn.value = !historyOn.value;
};

let keyboardOn = ref(false);

const toggleKeyboard = (event: Event) => {
  event.preventDefault();

  keyboardOn.value = !keyboardOn.value;
};

const pushing = async (letter: string) => {
  if (document.activeElement !== search.value) {
    search.value?.focus();
  }

  if (search.value && search.value.selectionStart !== undefined && desword.value.length < 125) {
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

  if (search.value) {
    if (cursorStart.value != cursorEnd.value) {
      desword.value =
        desword.value.slice(0, cursorStart.value) +
        desword.value.slice(cursorEnd.value);

      inputChanged();

      await nextTick();

      search.value.setSelectionRange(cursorStart.value, cursorStart.value);
    } else if (cursorStart.value != 0) {
      desword.value =
        desword.value.slice(0, cursorStart.value - 1) +
        desword.value.slice(cursorStart.value);

      inputChanged();

      await nextTick();

      search.value.setSelectionRange(
        cursorStart.value - 1,
        cursorStart.value - 1
      );
    }
  }
};

const submit = () => {
  emit("submit-request");
  search.value?.select();
};

const buttonClick = (event: Event) => {
  event.preventDefault();
};

const cleanTheInput = (event: Event) => {
desword.value = "";
event.preventDefault();

};


const randomWordTimeout = ref(false);

const randomWord = () => {
  if (!randomWordTimeout.value) {
    emit("random-request");
    randomWordTimeout.value = true;

    setTimeout(() => {
      randomWordTimeout.value = false;
    }, 2000);
  }
};

</script>

<template>
  <div @click="buttonClick" @mousedown="buttonClick">
    
    <ArmenianKeyboard
      class="aKeyboard"
      v-if="keyboardOn"
      @letter-pushed="pushing"
      @backspace-clicked="backSpace"
    ></ArmenianKeyboard>
    <div class="h-[269px]" v-else></div>
  </div>

  <div class="flex justify-center">
    <div class="bg-gray-200 p-6 border-2 border-black rounded-lg dark:bg-[#101010] dark:border-white transition-colors duration-300"
    >
      <ElementComponentsCustomButton
        class="block mx-auto border-b-0 rounded-t-lg rounded-b-none w-52 hover:bg-[#ccc] outline-none transition-colors duration-300"
        :text="sLineLang.keyboardButton"
        @click="toggleKeyboard($event)"
        @mousedown="buttonClick"
      />
      <div class="sm:w-[300px] md:w-[450px] lg:w-[600px] flex">
        <input
          type="text"
          ref="search"
          v-model="desword"
          class="motherinput"
          :placeholder="sLineLang.searching"
          autocomplete="off"
          autofocus
          maxlength="125"
          @input="inputChanged"
          @keydown="keyBase($event)"
        />
        

        <div class="bg-white border-t border-b border-black flex items-center h-[53px]">
          <Transition name="fade">
        <button @click="cleanTheInput($event)" @mousedown="buttonClick" class="mr-[10px] h-5" v-if="desword != ''">
          <img src="/cancel.png" width="20" height="20" />
        </button>
      </Transition>

      </div>

        <button @click="submit" @mousedown="buttonClick" class="motherbutton border-l border-black">
          <img src="/glass.png" width="30" height="30" />
        </button>
      </div>
      <div class="resultBox dark:text-black" v-show="isResultBoxVisible">
        <ul>
          <li
            @click="selectTheInput(item)"
            v-for="(item, index) in resultBoxContent"
            v-text="item"
            :class="{
              'bg-[#e9f3ff]': index == currentHoverIndex,
              'rounded-t-[20px]': index == 0,
              'rounded-b-[20px]': index == resultBoxContent.length - 1,
              'rounded-[20px]': index == 0 && resultBoxContent.length == 1,
            }"
            @mouseover="currentHoverIndex = index"
          ></li>
        </ul>
      </div>
      <searchHistory v-if="historyOn" @history-selected="selectTheInput"/>

    </div>

  </div>
  <ElementComponentsCustomButton class="border-b-0 rounded-b-lg rounded-t-none w-36 hover:bg-[#ccc] outline-none transition-colors duration-300"
        :text="sLineLang.historyButton"
        @click="toggleHistory($event)"
        @mousedown="buttonClick"
      />

      <ElementComponentsCustomButton class="border-b-0 rounded-b-lg rounded-t-none w-36 hover:bg-[#ccc] outline-none transition-colors duration-300"
        :text="'Random Word'"
        @click="randomWord()"
        @mousedown="buttonClick"
      />


</template>

<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.motherinput {
  flex: 1;
  height: 53px;
  background: transparent;
  outline: 0;
  font-size: 18px;
  color: #333;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-right: 7px;
  border-left-width: 1px;
  border-bottom-width: 1px;
  border-top-width: 1px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-color: black;
  background-color: white;
}

.motherbutton {
  cursor: pointer;
  width: 60px;
  height: 53px;
  background-color: limegreen;
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
  padding-left: 10px;
  margin-right: -2px;
  border-width: 1px;
  border-color: black;
  transition: background-color 0.3s;
}

.motherbutton:hover {
  background-color: chartreuse;
}
.motherbutton:active {
  transform: scale(0.95);
}


.resultBox {
  position: absolute;
  background-color: white;
  @apply w-full sm:w-[300px] md:w-[450px] lg:w-[600px];
  border-color: rgb(0 0 0 / var(--tw-border-opacity));
  border-width: 1px;
  border-radius: 20px;
  margin-top: 4px;
}

.resultBox ul li {
  list-style: none;
  padding: 5px 19px;
  cursor: pointer;
}

.resultBox ul li.highlighted {
  background: #e9f3ff;
}

</style>
