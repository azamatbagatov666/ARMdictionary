<script lang="ts" setup>
import { ref, onMounted } from "vue";

import type { TDATA } from "~/models/TDATA";
import { useDebounceFn } from "@vueuse/core";
import { useTemplateRef } from "vue";
const resultBox = useTemplateRef("resultBox");

const resultItems = ref<HTMLElement[]>([]);

const { t } = useI18n();

const currentHoverIndex = ref<number>(-1);
const desword = ref("");
const resultBoxContent = ref<string[]>([]);
const isResultBoxVisible = ref(false);
const search = ref<HTMLInputElement | null>(null);
const cursorStart = ref<number>(0);
const cursorEnd = ref<number>(0);
const suppressSuggestions = ref(false);
const keyboardOn = ref(false);

const todayData = ref();

import { useWindowSize } from "@vueuse/core";
import Calendar from "./SVG/Calendar.vue";
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
    if (data && Array.isArray(data) && data[0].ARANAN !== "NotFound") {
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
  return sanitizeAranan(desword.value.toLocaleLowerCase("tr-TR").trim());
});

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);

  if (width.value >= 1024) {
    search.value?.focus();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
});

const handleDocumentClick = (event: MouseEvent) => {
  const keyboard = document.querySelector(".aKeyboard");
  const mother = document.querySelector(".motherinput");

  if (keyboard && mother) {
    if (
      !keyboard.contains(event.target as Node) &&
      !mother.contains(event.target as Node)
    ) {
      isResultBoxVisible.value = false;
      currentHoverIndex.value = -1;
    }
  } else {
    isResultBoxVisible.value = false;
    currentHoverIndex.value = -1;
  }
};

const emit = defineEmits<{
  (e: "input-changed", data: string): void;
  (e: "submit-request"): void;
  (e: "random-request"): void;
  (e: "set-today", data: TDATA[]): void;
}>();

const fetchSuggestions = useDebounceFn(async () => {
  if (suppressSuggestions.value) return;

  let result: any[] = [];

  if (lcandtrimmed.value.length >= 2) {
    const { data, error } = await useFetch(
      `/api/search/${encodeURIComponent(lcandtrimmed.value)}/suggestions`,
      {
        method: "GET",
      },
    );
    if (error.value) {
      return;
    }

    if (suppressSuggestions.value) return;

    if (data) {
      listOfAvailableWords = [...(<[]>data.value)];
    }

    result = listOfAvailableWords.filter((keyword) => {
      return keyword.toLowerCase(); //.startsWith(lcandtrimmed.value) for no regex
    });

    currentHoverIndex.value = -1;

    isResultBoxVisible.value = result.length > 0;
  } else {
    isResultBoxVisible.value = false;
  }

  if (resultBox.value && width.value < 640) {
    resultBox.value.scrollTop = 0;
  }
  resultBoxContent.value = result;
}, 440);

const inputChanged = () => {
  suppressSuggestions.value = false;

  emit("input-changed", lcandtrimmed.value);
  fetchSuggestions();
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

const keyBase = (event: KeyboardEvent) => {
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
  ) {
    currentHoverIndex.value++;
    nextTick(scrollToActiveItem);
  } else if (
    resultBoxContent.value.length > 0 &&
    currentHoverIndex.value < resultBoxContent.value.length - 1
  ) {
    isResultBoxVisible.value = true;
  }
};

const keyUp = () => {
  if (isResultBoxVisible.value && currentHoverIndex.value >= 0) {
    currentHoverIndex.value--;
    nextTick(scrollToActiveItem);
  } else if (!isResultBoxVisible.value && resultBoxContent.value.length > 0) {
    isResultBoxVisible.value = true;
  }
};

const keyEnter = () => {
  suppressSuggestions.value = true;

  if (currentHoverIndex.value == -1) {
    emit("submit-request");
    if (width.value >= 1024) {
      search.value?.select();
    } else {
      search.value?.blur();
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

const toggleHistory = () => {

  historyOn.value = !historyOn.value;
};

const toggleKeyboard = (event: Event) => {
  event.preventDefault();

  keyboardOn.value = !keyboardOn.value;
};

const pushing = async (letter: string) => {
  if (
    document.activeElement !== search.value &&
    (width.value >= 1024 || letters.includes(letter))
  ) {
    search.value?.focus();
  }

  if (
    search.value &&
    search.value.selectionStart !== undefined &&
    desword.value.length < 125
  ) {
    if (width.value >= 1024 || letters.includes(letter)) {
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
        cursorStart.value + 1,
      );
    } else {
      search.value?.blur();

      desword.value += letter;
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
          cursorStart.value - 1,
        );
      }
    }
  } else {
    search.value?.blur();

    desword.value = desword.value.slice(0, -1);
    inputChanged();

    await nextTick();
  }
};

const submit = () => {
  suppressSuggestions.value = true;

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

const cleanButtonClick = (event: Event) => {
  event.preventDefault();
};

const cleanTheInput = (event: Event) => {
  desword.value = "";
  emit("input-changed", "");

  event.preventDefault();
};

const randomWordTimeout = ref(false);

const randomWord = () => {
  if (!randomWordTimeout.value) {
    emit("random-request");
    randomWordTimeout.value = true;

    setTimeout(() => {
      randomWordTimeout.value = false;
    }, 500);
  }
};

const letters = ["ç", "ğ", "ı", "o", "ş", "ü"];

const setToday = async () => {
  emit("set-today", todayData.value);
};

const sanitizeAranan = (value: string) => {
  return value
    .normalize("NFD") // split accents
    .replace(/\u0302/g, "") // remove circumflex ONLY
    .normalize("NFC")
    .replace(/[.!՝՛՞՜']/g, ""); // punctuation
};

const scrollToActiveItem = () => {
  const el = resultItems.value[currentHoverIndex.value];
  const container = resultBox.value;

  if (!el || !container) return;

  const elTop = el.offsetTop;
  const elBottom = elTop + el.offsetHeight;

  const boxTop = container.scrollTop;
  const boxBottom = boxTop + container.clientHeight;

  if (elTop < boxTop) {
    container.scrollTop = elTop;
  } else if (elBottom > boxBottom) {
    container.scrollTop = elBottom - container.clientHeight;
  }
};

defineExpose({ wordFromAbove, clearThePage, keyboardOn });
</script>

<template>
  <div class="mt-4 w-full">
    <div class="keyboard-wrapper">
      <Transition name="fade">
        <ArmenianKeyboard
          @click="buttonClick"
          @mousedown="buttonClick"
          class="aKeyboard"
          v-show="keyboardOn"
          @letter-pushed="pushing"
          @backspace-clicked="backSpace"
          :spaceBar="true"
          :backSpace="true"
          :longPress="true"
          :punctuation="true"
        >
        </ArmenianKeyboard>
      </Transition>
    </div>

    <div class="flex justify-center w-full">
      <div
        class="w-full sm:flex sm:justify-center sm:w-fit sm:flex-col lg:flex-col"
      >
        <div
          class="p-2 sm:px-4 md:p-6 md:!pb-2 lg:!rounded-tr-none frame w-full sm:w-[520px] md:w-[652px]"
          :class="{ 'lg:!rounded-bl-none': todayData }"
        >
          <ButtonCustom
            class="block select-none mx-auto border-b-0 rounded-t-lg rounded-b-none w-52 kButton dark:bg-[#262626] dark:text-[#ecf9ff] dark:border-white outline-none transition-colors duration-300"
            :text="t('searchLine.keyboardButton')"
            @click="toggleKeyboard($event)"
            @mousedown="buttonClick"
          />
          <div class="sm:w-[480px] md:w-[600px] flex justify-between">
            <input
              type="text"
              ref="search"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              v-model="desword"
              class="motherinput"
              :placeholder="t('searchLine.searching')"
              autocomplete="off"
              maxlength="125"
              @input="inputChanged"
              @keydown="keyBase($event)"
              @keyup.esc="
                isResultBoxVisible = false;
                currentHoverIndex = -1;
              "
            />

            <div
              class="bg-white dark:bg-[#262626] border-t border-b border-black dark:border-white flex items-center w-[37px] h-[53px] shrink-0 ml-[-1px]"
            >
              <Transition name="fade">
                <button
                  aria-label="Arama kutusunu temizle."
                  @click="cleanTheInput($event)"
                  @mousedown="cleanButtonClick"
                  class="mr-[10px] h-7"
                  v-if="desword != ''"
                >
<SVGCancel/>
                </button>
              </Transition>
            </div>

            <button
              aria-label="Arama Butonu"
              @click="submit"
              @mousedown="buttonClick"
              class="motherbutton border-l border-black dark:border-white shrink-0"
            >
<SVGGlass class="size-[30px]"/>
            </button>
          </div>
          <div
            ref="resultBox"
            class="resultBox max-h-[155px] sm:h-max sm:max-h-max dark:text-black"
            v-show="isResultBoxVisible && lcandtrimmed.length >= 2"
          >
            <ul class="">
              <li
                @click="selectTheInput(item)"
                v-for="(item, index) in resultBoxContent"
                v-text="item"
                ref="resultItems"
                :class="{
                  'bg-[#e9f3ff] text-black': index == currentHoverIndex,
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
            v-text="t('searchLine.searchTip')"
          ></div>
          <div class="flex justify-center">
            <button
              v-for="(letter, index) in letters"
              :key="index"
              class="turkish-button"
              v-text="letter"
              @click="pushing(letter)"
            ></button>
          </div>

          <SearchHistory v-if="historyOn" @history-selected="selectTheInput" />
        </div>
        <div class="flex justify-center mt-2 lg:hidden">
          <div class="flex gap-1 select-none">
            <!------------------ MOBILE ---------------------->
            <ButtonColorSVG
              :aria-label="'Günün Sözcüğünü Getir'"
              :colour="'red'"
              :buttonText="t('index.todaysword')"
              v-if="todayData"
              @button-clicked="setToday"
            >
                          <SVGCalendar/>

            </ButtonColorSVG>

            <ButtonColorSVG
              :aria-label="'Rastgele sözcük getir'"
              :colour="'purple'"
              :buttonText="t('searchLine.randomButton')"
              @button-clicked="randomWord()"
            >
<SVGRandom/>
            </ButtonColorSVG>

            <ButtonColorSVG
              :aria-label="'Arama geçmişini aç.'"
              :colour="'blue'"
              :buttonText="t('searchLine.historyButton')"
              @button-clicked="toggleHistory()"
            >
                   <SVGHistory/>

            </ButtonColorSVG>

  
          </div>
        </div>
        <!------------------ DESKTOP ---------------------->

        <button
          v-if="todayData"
          aria-label="Günün sözcüğünü getir."
          class="hidden lg:block group bg-gray-200 select-none !rounded-t-none !border-t-0 h-12 w-12 frame hover:!bg-red-600 hover:!w-40 origin-top-left active:scale-105"
          @click="setToday"
          @mousedown="buttonClick"
        >
          <div class="flex items-center ml-[5px]">
            <div class="rounded-full size-9 bg-red-600">
              <div
                class="rounded-full size-9 bg-red-600 flex items-center justify-center"
              >
            <SVGCalendar/>
              </div>
            </div>
            <div class="w-0">
              <span
                class="w-[112px] pointer-events-none inline-block opacity-0 leading-none group-hover:opacity-100 transition-opacity text-white group-hover:delay-300"
                v-text="t('index.todaysword')"
              ></span>
            </div>
          </div>
        </button>
      </div>
      <div class="w-0 flex-col gap-4 justify-start hidden lg:flex select-none">
        <!------------------ DESKTOP ---------------------->

        <button
          aria-label="Rastgele sözcük getir."
          class="group !rounded-l-none !border-l-0 h-12 w-12 frame hover:!bg-purple-600 hover:!w-40 origin-top-left active:scale-105"
          @click="randomWord()"
          @mousedown="buttonClick"
        >
          <div class="flex items-center ml-[5px]">
            <div
              class="rounded-full size-9 bg-purple-600 flex justify-center items-center"
            >
              <SVGRandom/>

            </div>
            <div class="w-0">
              <span
                class="pointer-events-none w-[112px] inline-block opacity-0 leading-none group-hover:opacity-100 transition-opacity text-white group-hover:delay-300"
                v-text="t('searchLine.randomButton')"
              ></span>
            </div>
          </div>
        </button>

        <button
          aria-label="Arama geçmişini aç."
          class="group !rounded-l-none !border-l-0 h-12 w-12 frame hover:!bg-blue-600 hover:!w-40 origin-top-left active:scale-105"
          @click="toggleHistory()"
          @mousedown="buttonClick"
        >
          <div class="flex items-center ml-[5px]">
            <div class="rounded-full flex items-center justify-center size-9 bg-blue-600">
     <SVGHistory/>
            </div>
            <div class="w-0">
              <span
                class="pointer-events-none w-[112px] inline-block opacity-0 leading-none group-hover:opacity-100 transition-opacity group-hover:delay-300 text-white"
                v-text="t('searchLine.historyButton')"
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
  transition-property:
    color, background-color, border-color, transform, text-decoration-color,
    fill, stroke, width;
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
  @apply border-black dark:border-white;
  background-color: white;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
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
  @apply border-black dark:border-white;
  transition: background-color 0.3s;
}
.dark .motherinput {
  background-color: #262626;
  color: #ecf9ff;
}

@media (hover: hover) and (pointer: fine) {
  .motherbutton:hover {
    background-color: chartreuse;
  }
  .kButton:hover {
    @apply dark:bg-neutral-700 bg-[#ccc];
  }
}

.kButton:active {
  @apply dark:bg-neutral-700 bg-[#ccc];
}

.motherbutton:active {
  transform: scale(0.95);
  background-color: chartreuse;
}

.resultBox ul li {
  list-style: none;
  padding: 5px 19px;
  cursor: pointer;
}

.resultBox ul li.highlighted {
  background: #e9f3ff;
}

.turkish-button {
  @apply size-1/12 p-1 m-[2px] sm:m-[5px] sm:size-[35px] sm:p-[10px];
  user-select: none;
  font-size: 16px;
  background-color: #3490dc;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding-top: 5px;
  outline: 0;
}

.turkish-button:active {
  background-color: #99c7ed;
}

@media (min-width: 1024px) and (min-height: 900px) {
  .keyboard-wrapper {
    height: 269px;
  }
}

.resultBox {
  position: absolute;
  background-color: white;
  @apply w-[calc(100%_-_17px)] sm:w-[482px] md:w-[602px];
  border-color: rgb(0 0 0 / var(--tw-border-opacity));
  border-width: 1px;
  border-radius: 20px;
  margin-top: 4px;
  overflow-y: auto;
}

.resultBox {
  background:
    /* Shadow covers */
    linear-gradient(white 30%, rgba(255, 255, 255, 0)),
    linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%,
    /* Shadows (NOW LINEAR) */
    linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0)),
    linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0)) 0 100%;

  background-color: white;

  background-repeat: no-repeat;

  background-size:
    100% 40px,
    100% 40px,
    100% 14px,
    100% 14px;

  background-attachment: local, local, scroll, scroll;
}

.dark .resultBox {
  color: #ecf9ff;
  border-color: white;

  background:
    /* Shadow covers (dark version) */
    linear-gradient(#262626 30%, rgba(38, 38, 38, 0)),
    linear-gradient(rgba(38, 38, 38, 0), #262626 70%) 0 100%,
    /* Shadows (same as light mode is fine) */
    linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0)),
    linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0)) 0
      100%;

  background-color: #262626;

  background-repeat: no-repeat;

  background-size:
    100% 40px,
    100% 40px,
    100% 14px,
    100% 14px;

  background-attachment: local, local, scroll, scroll;
}
</style>
