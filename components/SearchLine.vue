<script lang="ts" setup>
import { ref, onMounted } from "vue";

import type { TDATA } from "~/models/TDATA";
import { useDebounceFn } from "@vueuse/core";
import { useTemplateRef } from 'vue'
const resultBox = useTemplateRef('resultBox')

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
  return sanitizeAranan(
    desword.value
      .toLocaleLowerCase("tr-TR")
      .trim()
  );
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

  if (keyboard) {
    if (!keyboard.contains(event.target as Node)) {
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
      }
    );
    if (error.value) {
      return;
    }

    if (suppressSuggestions.value) return;


    if (data) {

      listOfAvailableWords = [...(<[]>data.value)];}

    result = listOfAvailableWords.filter((keyword) => {
      return keyword.toLowerCase();  //.startsWith(lcandtrimmed.value) for no regex
    });

    currentHoverIndex.value = -1;

    isResultBoxVisible.value = result.length > 0;
  } else {
    isResultBoxVisible.value = false;
  }
  
if (resultBox.value && width.value < 640) {
  resultBox.value.scrollTop = 0
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

    if (isResultBoxVisible.value && currentHoverIndex.value < resultBoxContent.value.length - 1){

    currentHoverIndex.value++;
  }
  else if(resultBoxContent.value.length > 0 && currentHoverIndex.value < resultBoxContent.value.length - 1)
  {
    isResultBoxVisible.value=true;

  }
    
};

const keyUp = () => {
  if ((isResultBoxVisible.value && currentHoverIndex.value >= 0))
{

    currentHoverIndex.value--;
    }
    else if ( !isResultBoxVisible.value && resultBoxContent.value.length > 0)
    {
    isResultBoxVisible.value=true;
      
    }
};

const keyEnter = () => {
    suppressSuggestions.value = true;

  if (currentHoverIndex.value == -1) {
    emit("submit-request");
    if (width.value >= 1024) {
      search.value?.select();
    }
    else {
    search.value?.blur();

    };
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


const toggleKeyboard = (event: Event) => {
  
  
  event.preventDefault();

  keyboardOn.value = !keyboardOn.value;
};

const pushing = async (letter: string) => {
  if (document.activeElement !== search.value && (width.value >= 1024 || letters.includes(letter))) {
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
    .normalize("NFD")          // split accents
    .replace(/\u0302/g, "")    // remove circumflex ONLY
    .normalize("NFC")
    .replace(/[.!?՝՛՞՜']/g, "") // punctuation
}


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
        >
        </ArmenianKeyboard>
      </Transition>
    </div>

    <div class="flex justify-center w-full">
      <div
        class="w-full sm:flex sm:justify-center sm:w-fit sm:flex-col lg:flex-col"
      >
        <div
          class="bg-gray-200 p-2 sm:px-4 md:p-6 md:!pb-2  border-2 border-black rounded-lg lg:!rounded-tr-none dark:bg-[#101010] dark:border-white transition-colors duration-300 w-full sm:w-[520px] md:w-[652px]"
          :class="{ 'lg:!rounded-bl-none': todayData }"
        >
          <ElementComponentsCustomButton
            class="block select-none mx-auto border-b-0 rounded-t-lg rounded-b-none w-52 kButton outline-none transition-colors duration-300"
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
              @keyup.esc="isResultBoxVisible = false; currentHoverIndex=-1"
            />

            <div
              class="bg-white border-t border-b border-black flex items-center w-[37px] h-[53px] shrink-0 ml-[-1px]"
            >
              <Transition name="fade">
                <button aria-label="Arama kutusunu temizle."
                  @click="cleanTheInput($event)"
                  @mousedown="cleanButtonClick"
                  class="mr-[10px] h-7"
                  v-if="desword != ''"
                >

  <svg fill="#000000"  class="size-7"  viewBox="0 0 32 32" version="1.1" >
  <title>cancel</title>
  <path d="M16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM21.961 12.209c0.244-0.244 0.244-0.641 0-0.885l-1.328-1.327c-0.244-0.244-0.641-0.244-0.885 0l-3.761 3.761-3.761-3.761c-0.244-0.244-0.641-0.244-0.885 0l-1.328 1.327c-0.244 0.244-0.244 0.641 0 0.885l3.762 3.762-3.762 3.76c-0.244 0.244-0.244 0.641 0 0.885l1.328 1.328c0.244 0.244 0.641 0.244 0.885 0l3.761-3.762 3.761 3.762c0.244 0.244 0.641 0.244 0.885 0l1.328-1.328c0.244-0.244 0.244-0.641 0-0.885l-3.762-3.76 3.762-3.762z"></path>
  </svg>
                </button>
              </Transition>
            </div>

            <button aria-label="Arama Butonu"
              @click="submit"
              @mousedown="buttonClick"
              class="motherbutton border-l border-black shrink-0"
            >
              <svg height="30px" width="30px" version="1.1"
	 viewBox="0 0 339.921 339.921" >
<path
 d="M335.165,292.071l-81.385-84.077c-5.836-6.032-13.13-8.447-16.29-5.363c-3.171,3.062-10.47,0.653-16.306-5.379l-1.164-1.207c36.425-47.907,32.89-116.499-10.851-160.24c-47.739-47.739-125.142-47.739-172.875,0c-47.739,47.739-47.739,125.131,0,172.87c44.486,44.492,114.699,47.472,162.704,9.045l0.511,0.533c5.825,6.032,7.995,13.402,4.814,16.469c-3.166,3.068-1.012,10.443,4.83,16.464l81.341,84.11c5.836,6.016,15.452,6.195,21.49,0.354l22.828-22.088C340.827,307.735,340.99,298.125,335.165,292.071z M182.306,181.81c-32.852,32.857-86.312,32.857-119.159,0.011c-32.852-32.852-32.847-86.318,0-119.164c32.847-32.852,86.307-32.847,119.148,0.005C215.152,95.509,215.152,148.964,182.306,181.81z"
/>
</svg>
            </button>
          </div>
          <div ref="resultBox" class="resultBox max-h-[155px] sm:h-max sm:max-h-max dark:text-black" v-show="isResultBoxVisible && lcandtrimmed.length >= 2">
            <ul class="">
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
            v-text="t('searchLine.searchTip')"
          ></div>
          <div class="flex justify-center">
      <button  v-for="(letter, index) in letters" :key="index"  class="turkish-button"
        v-text="letter" @click="pushing(letter)"></button>
    </div>

          <searchHistory v-if="historyOn" @history-selected="selectTheInput" />
        </div>
        <div class="flex justify-center mt-2 lg:hidden">
          <div class="flex gap-1 select-none">

          <button
              v-if="todayData" aria-label="Günün sözcüğünü getir."
              class="bg-gray-200 rounded-md border-2 transition-transform active:!bg-red-600 border-black h-12 w-28 dark:border-white dark:bg-[#101010] origin-top-left active:scale-105"
              @click="setToday"
              @mousedown="buttonClick"
            >
              <div class="flex items-center ml-[5px]">
                <div class="rounded-full size-9 bg-red-600">
                                 <div class="rounded-full size-9 bg-red-600 flex items-center justify-center">
<svg width="27px" height="27px" viewBox="0 0 15 15" fill="none">
    <path
    fill="white"
    d="
      M4 1
      C4.28 1 4.5 1.22 4.5 1.5V2.5H10.5V1.5
      C10.5 1.22 10.72 1 11 1
      C11.28 1 11.5 1.22 11.5 1.5V2.5H12.5
      C13.33 2.5 14 3.17 14 4V12.5
      C14 13.33 13.33 14 12.5 14H2.5
      C1.67 14 1 13.33 1 12.5V4
      C1 3.17 1.67 2.5 2.5 2.5H3.5V1.5
      C3.5 1.22 3.72 1 4 1
      Z

      M2 5.5H13V12.5
      C13 12.78 12.78 13 12.5 13H2.5
      C2.22 13 2 12.78 2 12.5V5.5Z
    "
  />
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7ZM11 7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8C11.2239 8 11 7.77614 11 7.5ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM9 9.5C9 9.22386 9.22386 9 9.5 9C9.77614 9 10 9.22386 10 9.5C10 9.77614 9.77614 10 9.5 10C9.22386 10 9 9.77614 9 9.5ZM7.5 9C7.22386 9 7 9.22386 7 9.5C7 9.77614 7.22386 10 7.5 10C7.77614 10 8 9.77614 8 9.5C8 9.22386 7.77614 9 7.5 9ZM5 9.5C5 9.22386 5.22386 9 5.5 9C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10C5.22386 10 5 9.77614 5 9.5ZM3.5 9C3.22386 9 3 9.22386 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 9.22386 3.77614 9 3.5 9ZM3 11.5C3 11.2239 3.22386 11 3.5 11C3.77614 11 4 11.2239 4 11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 11.2239 5.77614 11 5.5 11ZM7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5C10 11.2239 9.77614 11 9.5 11Z"
    fill="#101010"
  />
</svg>
</div>
                </div>
                <div class="w-0">
                  <span
                    class="w-[63px] pointer-events-none inline-block leading-none transition-opacity dark:text-white group-hover:delay-300"
                    v-text="t('index.todaysword')"
                  ></span>
                </div>
              </div>
            </button>
            <button aria-label="Rastgele sözcük getir."
              class="rounded-md border-2 border-black h-12 w-28 transition-transform active:!bg-purple-600 dark:border-white bg-gray-200 dark:bg-[#101010] origin-top-left active:scale-105"
              @click="randomWord()"
              @mousedown="buttonClick"
            >
              <div class="flex items-center ml-[5px]">
                <div class="rounded-full size-9 bg-purple-600 flex justify-center items-center">
                  
<svg width="30px" height="30px" viewBox="0 0 24 24" version="1.1">
    




            <path  d="M4,17 C3.44771525,17 3,16.5522847 3,16 C3,15.4477153 3.44771525,15 4,15 L6,15 L9,12 L6,9 L4,9 C3.45000005,9 3,8.55245148 3,8.00122564 C3,7.44999981 3.45000005,7 4,7 L7,7 L11,11 L15,7 L17,7 L17,5 L21,8.00122564 L17,11 L17,9 L16,9 L13,12 L16,15 L17,15 L17,13 L21,16 L17,19 L17,17 L15,17 L11,13 L7,17 L4,17 Z" fill="#ffffff">

</path>

</svg>
                </div>
                <div class="w-0">
                  <span
                    class="pointer-events-none w-[63px] inline-block break-words leading-none transition-opacity dark:text-white"
                    v-text="t('searchLine.randomButton')"
                  ></span>
                </div>
              </div>
            </button>

            <button aria-label="Arama geçmişini aç."
              class="bg-gray-200 rounded-md border-2 transition-transform active:!bg-blue-600 border-black h-12 w-28 dark:border-white dark:bg-[#101010] origin-top-left active:scale-105"
              @click="toggleHistory($event)"
              @mousedown="buttonClick"
            >
              <div class="flex items-center ml-[5px]">
                <div class="rounded-full flex items-center size-9 bg-blue-600">
<svg width="28px" height="28px" class="ml-[4px]" viewBox="0 0 24 24" fill="none">
<path d="M5.52786 16.7023C6.6602 18.2608 8.3169 19.3584 10.1936 19.7934C12.0703 20.2284 14.0409 19.9716 15.7434 19.0701C17.446 18.1687 18.766 16.6832 19.4611 14.8865C20.1562 13.0898 20.1796 11.1027 19.527 9.29011C18.8745 7.47756 17.5898 5.96135 15.909 5.02005C14.2282 4.07875 12.2641 3.77558 10.3777 4.16623C8.49129 4.55689 6.80919 5.61514 5.64045 7.14656C4.47171 8.67797 3.89482 10.5797 4.01579 12.5023M4.01579 12.5023L2.51579 11.0023M4.01579 12.5023L5.51579 11.0023" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 8V12L15 15" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                </div>
                <div class="w-0">
                  <span
                    class="pointer-events-none w-[63px] inline-block break-words leading-none transition-opacity dark:text-white"
                    v-text="t('searchLine.historyButton')"
                  ></span>
                </div>
              </div>
            </button>


          </div>
        </div>
        <button
          v-if="todayData" aria-label="Günün sözcüğünü getir."
          class="hidden lg:block group bg-gray-200 select-none rounded-b-md border-2 border-t-0 border-black h-12 w-12 duration-300 dark:border-white dark:bg-[#101010] hover:!bg-red-600 hover:!w-40 origin-top-left active:scale-105"
          @click="setToday"
          @mousedown="buttonClick"
        >
          <div class="flex items-center ml-[5px]">
            <div class="rounded-full size-9 bg-red-600">
                  <div class="rounded-full size-9 bg-red-600 flex items-center justify-center">
<svg width="27px" height="27px" viewBox="0 0 15 15" fill="none">
    <path
    fill="white"
    d="
      M4 1
      C4.28 1 4.5 1.22 4.5 1.5V2.5H10.5V1.5
      C10.5 1.22 10.72 1 11 1
      C11.28 1 11.5 1.22 11.5 1.5V2.5H12.5
      C13.33 2.5 14 3.17 14 4V12.5
      C14 13.33 13.33 14 12.5 14H2.5
      C1.67 14 1 13.33 1 12.5V4
      C1 3.17 1.67 2.5 2.5 2.5H3.5V1.5
      C3.5 1.22 3.72 1 4 1
      Z

      M2 5.5H13V12.5
      C13 12.78 12.78 13 12.5 13H2.5
      C2.22 13 2 12.78 2 12.5V5.5Z
    "
  />
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7ZM11 7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8C11.2239 8 11 7.77614 11 7.5ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM9 9.5C9 9.22386 9.22386 9 9.5 9C9.77614 9 10 9.22386 10 9.5C10 9.77614 9.77614 10 9.5 10C9.22386 10 9 9.77614 9 9.5ZM7.5 9C7.22386 9 7 9.22386 7 9.5C7 9.77614 7.22386 10 7.5 10C7.77614 10 8 9.77614 8 9.5C8 9.22386 7.77614 9 7.5 9ZM5 9.5C5 9.22386 5.22386 9 5.5 9C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10C5.22386 10 5 9.77614 5 9.5ZM3.5 9C3.22386 9 3 9.22386 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 9.22386 3.77614 9 3.5 9ZM3 11.5C3 11.2239 3.22386 11 3.5 11C3.77614 11 4 11.2239 4 11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 11.2239 5.77614 11 5.5 11ZM7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5C10 11.2239 9.77614 11 9.5 11Z"
    fill="#101010"
  />
</svg>
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
        <button aria-label="Rastgele sözcük getir."
          class="group bg-gray-200 rounded-r-md border-2 border-l-0 border-black h-12 w-12 duration-300 dark:border-white dark:bg-[#101010] hover:!bg-purple-600 hover:!w-40 origin-top-left active:scale-105"
          @click="randomWord()"
          @mousedown="buttonClick"
        >
          <div class="flex items-center ml-[5px]">
                <div class="rounded-full size-9 bg-purple-600 flex justify-center items-center">
                  
<svg width="30px" height="30px" viewBox="0 0 24 24" version="1.1">
    




            <path  d="M4,17 C3.44771525,17 3,16.5522847 3,16 C3,15.4477153 3.44771525,15 4,15 L6,15 L9,12 L6,9 L4,9 C3.45000005,9 3,8.55245148 3,8.00122564 C3,7.44999981 3.45000005,7 4,7 L7,7 L11,11 L15,7 L17,7 L17,5 L21,8.00122564 L17,11 L17,9 L16,9 L13,12 L16,15 L17,15 L17,13 L21,16 L17,19 L17,17 L15,17 L11,13 L7,17 L4,17 Z" fill="#ffffff">

</path>

</svg>
                </div>
            <div class="w-0">
              <span
                class="pointer-events-none w-[112px] inline-block opacity-0 leading-none group-hover:opacity-100 transition-opacity text-white group-hover:delay-300"
                v-text="t('searchLine.randomButton')"
              ></span>
            </div>
          </div>
        </button>

        <button aria-label="Arama geçmişini aç."
          class="group bg-gray-200 rounded-r-md border-2 border-l-0 border-black h-12 w-12 duration-300 dark:border-white dark:bg-[#101010] hover:!bg-blue-600 hover:!w-40 origin-top-left active:scale-105"
          @click="toggleHistory($event)"
          @mousedown="buttonClick"
        >
          <div class="flex items-center ml-[5px]">
            <div class="rounded-full flex items-center size-9 bg-blue-600">
<svg width="28px" height="28px" class="ml-[4px]" viewBox="0 0 24 24" fill="none">
<path d="M5.52786 16.7023C6.6602 18.2608 8.3169 19.3584 10.1936 19.7934C12.0703 20.2284 14.0409 19.9716 15.7434 19.0701C17.446 18.1687 18.766 16.6832 19.4611 14.8865C20.1562 13.0898 20.1796 11.1027 19.527 9.29011C18.8745 7.47756 17.5898 5.96135 15.909 5.02005C14.2282 4.07875 12.2641 3.77558 10.3777 4.16623C8.49129 4.55689 6.80919 5.61514 5.64045 7.14656C4.47171 8.67797 3.89482 10.5797 4.01579 12.5023M4.01579 12.5023L2.51579 11.0023M4.01579 12.5023L5.51579 11.0023" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 8V12L15 15" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
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
  transition-property: color, background-color, border-color, transform,
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
  border-color: black;
  transition: background-color 0.3s;
}

@media (hover: hover) and (pointer: fine) {
.motherbutton:hover {
  background-color: chartreuse;
}
.kButton:hover {
  @apply bg-[#ccc];
}
  }


.motherbutton:active {
  transform: scale(0.95);
  background-color: chartreuse;

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



</style>
