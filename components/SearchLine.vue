<script lang="ts" setup>
import { ref, onMounted } from "vue";

import type { TDATA } from "~/models/TDATA";

const currentHoverIndex = ref<number>(-1);
const desword = ref("");
const resultBoxContent = ref<string[]>([]);
const isResultBoxVisible = ref(false);
const search = ref<HTMLInputElement | null>(null);
const cursorStart = ref<number>(0);
const cursorEnd = ref<number>(0);

const todayData = ref();

import { useWindowSize } from "@vueuse/core";
const { width } = useWindowSize();

const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value.path);

onBeforeMount(async () => {
  if (currentRoute.value == "/") {
    getToday();
  }
});

const getToday = async () => {
  try {
    const data = await $fetch(`/api/get/getTodaysWord`, {
      method: "GET",
    });
    if (data && Array.isArray(data) && data[0].aranan !== "NotFound") {
      todayData.value = data;
    } else {
    }
  } catch (error) {}
};

const { $bus } = useNuxtApp();

$bus.on("clear-main-page", () => {
  clearThePage();
});

const clearThePage = () => {
  desword.value = "";
  keyboardOn.value = false;
  historyOn.value = false;
  if (document.activeElement !== search.value && width.value >= 1024) {
    search.value?.focus();
  }
};

var listOfAvailableWords: string[];
listOfAvailableWords = [];

const lcandtrimmed = computed(() => {
  return desword.value.toLocaleLowerCase("tr-TR").trim();
});

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  search.value?.focus();
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
  (e: "set-today", data: TDATA[]): void;
}>();

const inputChanged = async () => {
  emit("input-changed", lcandtrimmed.value);
  let result: any[] = [];

  if (lcandtrimmed.value.length >= 3) {
    const { data, error } = await useFetch(
      `/api/search/${encodeURI(lcandtrimmed.value)}/suggestions`,
      {
        method: "GET",
      }
    );
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
    if (width.value >= 1024) {
      search.value?.select();
    }
  });
};

const wordFromAbove = (newDesword: string) => {
  desword.value = newDesword;
  nextTick(() => {
    if (width.value >= 1024) {
      search.value?.select();
    }
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
  if (
    isResultBoxVisible.value &&
    currentHoverIndex.value < resultBoxContent.value.length - 1
  )
    currentHoverIndex.value++;
};

const keyUp = () => {
  if (isResultBoxVisible.value && currentHoverIndex.value >= 0)
    currentHoverIndex.value--;
};

const keyEnter = () => {
  if (currentHoverIndex.value == -1) {
    emit("submit-request");
    if (width.value >= 1024) {
      search.value?.select();
    }
    isResultBoxVisible.value = false;
  } else {
    desword.value = resultBoxContent.value[currentHoverIndex.value];
    emit("input-changed", lcandtrimmed.value);
    emit("submit-request");
    resultBoxContent.value = [];
    currentHoverIndex.value = -1;
    isResultBoxVisible.value = false;
    nextTick(() => {
      if (width.value >= 1024) {
        search.value?.select();
      }
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
  if (document.activeElement !== search.value && width.value >= 1024) {
    search.value?.focus();
  }

  if (
    search.value &&
    search.value.selectionStart !== undefined &&
    desword.value.length < 125
  ) {

    if (width.value >= 1024) {
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
    } else {
    search.value?.blur();

    desword.value += letter
     await nextTick();

    inputChanged();
    }
    
  }
};

const backSpace = async () => {
  if (document.activeElement !== search.value && width.value >= 1024) {
    search.value?.focus();
  }

  if (width.value >= 1024) {
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

  }
    else {
    search.value?.blur();

    desword.value = desword.value.slice(0, -1);
          inputChanged();

      await nextTick();

  }
};

const submit = () => {
  emit("submit-request");
  if (width.value >= 1024) {
    search.value?.select();
  } else {
    search.value?.blur();
  }
};

const buttonClick = (event: Event) => {
  if (width.value >= 1024) {
  event.preventDefault();
    
  }
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

const setToday = async () => {
  emit("set-today", todayData.value);
};

defineExpose({ wordFromAbove, clearThePage });
</script>

<template>
  <div class="mt-4 w-full">
    <div class="lg:h-[269px]">
      <Transition name="fade">
        <ArmenianKeyboard
          @click="buttonClick"
          @mousedown="buttonClick"
          class="aKeyboard"
          v-show="keyboardOn"
          @letter-pushed="pushing"
          @backspace-clicked="backSpace"
        >
        </ArmenianKeyboard>
      </Transition>
    </div>

    <div class="flex justify-center w-full">
      <div
        class="w-full sm:flex sm:justify-center sm:w-fit sm:flex-col lg:flex-col"
      >
        <div
          class="bg-gray-200 p-2 lg:p-6 pb-1 border-2 border-black rounded-lg lg:!rounded-tr-none dark:bg-[#101010] dark:border-white transition-colors duration-300 w-full sm:w-[520px] md:w-[652px]"
          :class="{ 'lg:!rounded-bl-none': todayData }"
        >
          <ElementComponentsCustomButton
            class="block mx-auto border-b-0 rounded-t-lg rounded-b-none w-52 hover:bg-[#ccc] outline-none transition-colors duration-300"
            :text="$t('searchLine.keyboardButton')"
            @click="toggleKeyboard($event)"
            @mousedown="buttonClick"
          />
          <div class="sm:w-[480px] md:w-[600px] flex justify-between">
            <input
              type="text"
              ref="search"
              v-model="desword"
              class="motherinput"
              :placeholder="$t('searchLine.searching')"
              autocomplete="off"
              maxlength="125"
              @input="inputChanged"
              @keydown="keyBase($event)"
            />

            <div
              class="bg-white border-t border-b border-black flex items-center w-[30px] h-[53px] shrink-0"
            >
              <Transition name="fade">
                <button
                  @click="cleanTheInput($event)"
                  @mousedown="buttonClick"
                  class="mr-[10px] h-5"
                  v-if="desword != ''"
                >
                  <img
                    src="/cancel.png"
                    draggable="false"
                    class="max-w-5 size-5"
                  />
                </button>
              </Transition>
            </div>

            <button
              @click="submit"
              @mousedown="buttonClick"
              class="motherbutton border-l border-black shrink-0"
            >
              <img src="/glass.png" width="30" height="30" draggable="false" />
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
          <div
            class="text-center text-sm my-1"
            v-text="$t('searchLine.searchTip')"
          ></div>

          <searchHistory v-if="historyOn" @history-selected="selectTheInput" />
        </div>
        <div class="flex justify-start my-1 lg:hidden">
          <div class="grid gap-1">
            <button
              class="group rounded-md border-2 border-black h-12 w-40 duration-300 dark:border-white bg-gray-200 dark:bg-[#101010] origin-top-left active:scale-105"
              @click="randomWord()"
              @mousedown="buttonClick"
            >
              <div class="flex items-center ml-[5px]">
                <div class="rounded-full size-9 bg-purple-600">
                  <img src="/random.png" class="size-9" draggable="false" />
                </div>
                <div class="w-0">
                  <span
                    class="pointer-events-none w-[112px] inline-block leading-none transition-opacity dark:text-white"
                    v-text="$t('searchLine.randomButton')"
                  ></span>
                </div>
              </div>
            </button>

            <button
              class="group bg-gray-200 rounded-md border-2 border-black h-12 w-40 duration-300 dark:border-white dark:bg-[#101010] origin-top-left active:scale-105"
              @click="toggleHistory($event)"
              @mousedown="buttonClick"
            >
              <div class="flex items-center ml-[5px]">
                <div class="rounded-full flex items-center size-9 bg-blue-600">
                  <img
                    src="/history.png"
                    class="ml-[3px] size-7"
                    draggable="false"
                  />
                </div>
                <div class="w-0">
                  <span
                    class="pointer-events-none w-[112px] inline-block leading-none transition-opacity dark:text-white"
                    v-text="$t('searchLine.historyButton')"
                  ></span>
                </div>
              </div>
            </button>

            <button
              v-if="todayData"
              class="bg-gray-200 rounded-md border-2 border-black h-12 w-40 place-items-center duration-300 dark:border-white dark:bg-[#101010] origin-top-left active:scale-105"
              @click="setToday"
              @mousedown="buttonClick"
            >
              <div class="flex items-center ml-[5px]">
                <div class="rounded-full size-9 bg-red-600">
                  <img src="/day.png" class="size-9" draggable="false" />
                </div>
                <div class="w-0">
                  <span
                    class="w-[112px] pointer-events-none inline-block leading-none transition-opacity dark:text-white group-hover:delay-300"
                    v-text="$t('index.todaysword')"
                  ></span>
                </div>
              </div>
            </button>
          </div>
        </div>
        <button
          v-if="todayData"
          class="hidden lg:block group bg-gray-200 rounded-b-md border-2 border-t-0 border-black h-12 w-12 place-items-center duration-300 dark:border-white dark:bg-[#101010] hover:!bg-red-600 hover:!w-40 origin-top-left active:scale-105"
          @click="setToday"
          @mousedown="buttonClick"
        >
          <div class="flex items-center ml-[5px]">
            <div class="rounded-full size-9 bg-red-600">
              <img src="/day.png" class="size-9" draggable="false" />
            </div>
            <div class="w-0">
              <span
                class="w-[112px] pointer-events-none inline-block opacity-0 leading-none group-hover:opacity-100 transition-opacity text-white group-hover:delay-300"
                v-text="$t('index.todaysword')"
              ></span>
            </div>
          </div>
        </button>
      </div>
      <div class="w-0 flex-col gap-4 justify-start hidden lg:flex">
        <button
          class="group bg-gray-200 rounded-r-md border-2 border-l-0 border-black h-12 w-12 duration-300 dark:border-white dark:bg-[#101010] hover:!bg-purple-600 hover:!w-40 origin-top-left active:scale-105"
          @click="randomWord()"
          @mousedown="buttonClick"
        >
          <div class="flex items-center ml-[5px]">
            <div class="rounded-full size-9 bg-purple-600">
              <img src="/random.png" class="size-9" draggable="false" />
            </div>
            <div class="w-0">
              <span
                class="pointer-events-none w-[112px] inline-block opacity-0 leading-none group-hover:opacity-100 transition-opacity text-white group-hover:delay-300"
                v-text="$t('searchLine.randomButton')"
              ></span>
            </div>
          </div>
        </button>

        <button
          class="group bg-gray-200 rounded-r-md border-2 border-l-0 border-black h-12 w-12 duration-300 dark:border-white dark:bg-[#101010] hover:!bg-blue-600 hover:!w-40 origin-top-left active:scale-105"
          @click="toggleHistory($event)"
          @mousedown="buttonClick"
        >
          <div class="flex items-center ml-[5px]">
            <div class="rounded-full flex items-center size-9 bg-blue-600">
              <img
                src="/history.png"
                class="ml-[3px] size-7"
                draggable="false"
              />
            </div>
            <div class="w-0">
              <span
                class="pointer-events-none w-[112px] inline-block opacity-0 leading-none group-hover:opacity-100 transition-opacity group-hover:delay-300 text-white"
                v-text="$t('searchLine.historyButton')"
              ></span>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
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

.group {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, width;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
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
  @apply w-[calc(100%_-_50px)] sm:w-[482px] md:w-[602px];
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
