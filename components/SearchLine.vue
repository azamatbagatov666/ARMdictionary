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

/*
const cleaningState = useCleaningState();
watch(
  () => cleaningState.value,
  (newValue, oldValue) => {
    if (newValue === true) {
      desword.value=""
      cleaningState.value = false;
    }
  }
);*/

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
  } else isResultBoxVisible.value = false;
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
  if (currentHoverIndex.value < resultBoxContent.value.length - 1)
    currentHoverIndex.value++;
};

const keyUp = () => {
  if (currentHoverIndex.value >= 0) currentHoverIndex.value--;
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

let keyboardOn = ref(false);

const toggleKeyboard = (event: Event) => {
  event.preventDefault();

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
</script>

<template>

  <div @click="buttonClick"
        @mousedown="buttonClick">
    <ArmenianKeyboard
      class="aKeyboard"
      v-if="keyboardOn"
      @letter-pushed="pushing"
      @backspace-clicked="backSpace"
    ></ArmenianKeyboard>
    <div class="h-[269px]" v-else></div>
  </div>


  <div class="flex justify-center">
    <div
      class="bg-gray-200 p-6 border-2 border-black rounded-lg dark:bg-[#101010] dark:border-white transition-colors duration-300"
    >
      <ElementComponentsCustomButton
        class="block mx-auto border-b-0 rounded-t-lg rounded-b-none w-52 hover:bg-[#ccc] outline-none transition-colors duration-300"
        :text="keyboardButton"
        @click="toggleKeyboard($event)"
        @mousedown="buttonClick"/>
      <div class="sm:w-[300px] md:w-[450px] lg:w-[600px] flex">
          <input
            type="text"
            ref="search"
            v-model="desword"
            class="motherinput"
            :placeholder="searching"
            autocomplete="off"
            autofocus
            @input="inputChanged"
            @keydown="keyBase($event)"
          />

          <button @click="submit" class="motherbutton border-l border-black">
            <img src="/glass.png" width="35" height="35" />
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
    </div>
  </div>
</template>

<style scoped>
.motherinput {
  flex: 1;
  height: 72px;
  background: transparent;
  outline: 0;
  font-size: 18px;
  color: #333;
  padding-top: 35px;
  padding-bottom: 35px;
  padding-left: 20px;
  padding-right: 11px;
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
  height: 72px;
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


.row {
  display: flex;
  align-items: center;
  --tw-border-opacity: 1;
  border-color: rgb(0 0 0 / var(--tw-border-opacity));
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
  padding: 10px 12px;
  cursor: pointer;
}

.resultBox ul li.highlighted {
  background: #e9f3ff;
}


</style>
