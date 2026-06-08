<script setup lang="ts">
const { t } = useI18n();
import { useTemplateRef } from "vue";

const title = computed(() => t("title.adamasmaca"));
const description = computed(() => t("meta.adamasmaca"));

useHead({
  title,
  meta: [
    {
      name: "description",
      content: description,
    },
  ],
});

const target = useTemplateRef("target");

const hangmanVis = ref(0);
const answer = ref();
const answerArray = ref<string[]>([]);
const guesses = ref<string[]>([]);
const connectionError = ref(false);
const won = ref();

import { useWindowSize } from "@vueuse/core";
const { width } = useWindowSize();



const correctLetters = computed(() => {
  return [
    ...new Set(
      answerArray.value.filter((item) => guesses.value.includes(item)),
    ),
  ];
});

const usedLetters = computed(() => {
  return guesses.value.filter((value) => !answerArray.value.includes(value));
});

const scrollToTarget = () => {
  nextTick(() => {
    if (target.value) {
      target.value.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
};

const push = (letter: string) => {
  if (
    !guesses.value.includes(letter) &&
    hangmanVis.value < 8 &&
    !answerArray.value.every((value) => guesses.value.includes(value))
  ) {
    guesses.value.push(letter);
    if (answerArray.value.every((value) => guesses.value.includes(value))) {
      won.value = true;
      if (width.value < 1430) {
        scrollToTarget();
      }
    }
    if (!answer.value.includes(letter)) {
      hangmanVis.value += 1;
    }
  }
  if (
    hangmanVis.value == 8 &&
    !answerArray.value.every((value) => guesses.value.includes(value))
  ) {
    guesses.value = guesses.value.concat(answerArray.value);
    won.value = false;
    if (width.value < 1430) {
      scrollToTarget();
    }
  }
};

onBeforeMount(async () => {
  newGame();
});



const newGame = async () => {
  try {
    const data = await $fetch(`/api/get/getHangman`, {
      method: "GET",
    });
    if (data) {
      responseData.value = data;
      answer.value = responseData.value[0].ARANAN;
      answerArray.value = answer.value.split("");

      if (width.value < 1430) {
        window.scrollTo(0, 0);
      }
    }
  } catch (error) {
    connectionError.value = true;
    answer.value = null;
  }
};

const newGameTimeout = ref(false);

const clear = () => {
  if (!newGameTimeout.value) {
    hangmanVis.value = 0;
    answer.value = null;
    guesses.value = [];
    won.value = null;
    responseData.value = null;

    newGame();
    newGameTimeout.value = true;

    setTimeout(() => {
      newGameTimeout.value = false;
    }, 2000);
  }
};

const responseData = ref();
</script>

<template>
  <div>
    <ElementComponentsLogoBanner class="relative min-[1430px]:!absolute" />

    <div
      class="h-[65dvh] flex items-center justify-center"
      v-if="!answer && !connectionError"
    >
      <ElementComponentsLoadingAnimation />
    </div>
    <div class="min-[1430px]:flex min-[1430px]:justify-center">
      <div v-if="answer">
        <div
          class="flex justify-center min-[730px]:px-2 h-[180px] min-[730px]:h-[366px] w-[265px] min-[730px]:w-[254px] mx-auto min-[730px]:mt-2  select-none frame"
        >
          <div class="hangman relative w-[250px] min-[730px]:top-[10px]">
            <div class="absolute">
              <div class="gallows relative">
                <div v-if="hangmanVis > 0">
                  <div class="gallowsbody"></div>
                  <div class="gallowsstand"></div>
                  <div class="gallowstop"></div>
                  <div class="gallowscorner"></div>
                </div>
                <div class="gallowsrope" v-if="hangmanVis > 1"></div>
              </div>
            </div>
            <div class="absolute left-[70px] top-[40px]">
              <div class="stickman relative">
                <div class="head" v-if="hangmanVis > 2"></div>
                <div class="torso" v-if="hangmanVis > 3"></div>
                <div class="leftarm" v-if="hangmanVis > 4"></div>
                <div class="rightarm" v-if="hangmanVis > 5"></div>
                <div v-if="hangmanVis > 6">
                  <div class="leftleg"></div>
                  <div class="leftfoot"></div>
                </div>
                <div v-if="hangmanVis > 7">
                  <div class="rightleg"></div>
                  <div class="rightfoot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center text-lg mt-1 text-white">
          <span v-text="8 - hangmanVis"></span
          ><span v-text="t('adamAsmaca.rightsLeft')"></span>
        </div>
        <div class="text-center text-red-500 font-bold h-7 text-lg">
          <div v-show="won" v-text="t('adamAsmaca.win')"></div>
          <div v-show="won == false" v-text="t('adamAsmaca.lose')"></div>
        </div>

        <div class="h-16 flex justify-center">
          <div
            class="text-center px-3 pt-2 inline-block  select-none frame"
            v-if="answer"
          >
            <div
              class="inline-block"
              v-for="(character, index) in answerArray"
              :key="index"
            >
              <div class="flex h-8 w-full">
                <div
                  class="w-5 sm:w-8 ml-1 text-center text-xl sm:text-3xl"
                  :class="{ 'ml-0': index === 0 }"
                  v-text="character"
                  v-if="guesses.includes(character)"
                ></div>
              </div>
              <div class="flex mt-3 w-full">
                <div
                  class="w-5 sm:w-8 h-1 ml-1 bg-purple-500"
                  :class="{ 'ml-0': index === 0 }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="" v-if="answer">
          <ArmenianKeyboard
            @letter-pushed="push"
            :usedLetters="usedLetters"
            :correctLetters="correctLetters"
          >
          </ArmenianKeyboard>
        </div>

        <ElementComponentsCustomButton
          class="mx-auto block w-28"
          @click="clear"
          v-text="t('adamAsmaca.reset')"
        />
      </div>
      <div
        v-else-if="connectionError"
        class="text-3xl flex items-center justify-center h-[90vh] text-white font-bold"
        v-text="t('adamAsmaca.noConnection')"
      ></div>

      <div
        ref="target"
        v-if="won != null"
        class="min-[1430px]:absolute right-24"
      >
        <wordTable
          :responseData="responseData"
          :class="'min-[1430px]:w-[396px]'"
        ></wordTable>
      </div>
    </div>
  </div>
</template>

<style scoped>




.gallowscorner {
  width: 100px;
  height: 10px;
  border: 3px solid black;
  display: block;
  position: absolute;
  left: 30px;
  transform: rotate(-40deg);
  transform-origin: 100%;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300;
}

.gallowsbody {
  width: 10px;
  border: 3px solid black;
  display: block;
  position: absolute;
  left: 47px;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300 h-[166px] min-[730px]:h-[314px];
}

.gallowsrope {
  width: 2px;
  height: 40px;
  display: block;
  position: absolute;
  left: 170px;
  background-color: black;
  @apply dark:bg-white transition-colors duration-300 h-[25px] min-[730px]:h-10 left-[171px] min-[730px]:left-[170px];
}

.gallowstop {
  width: 150px;
  height: 10px;
  border: 3px solid black;
  display: block;
  position: absolute;
  left: 56px;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300;
}

.gallowsstand {
  width: 100px;
  height: 22px;
  border: 3px solid black;
  display: block;
  position: absolute;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300 top-[166px] min-[730px]:top-[314px] h-[10px] min-[730px]:h-[22px];
}

.head {
  border: 5px solid black;
  border-radius: 50%;
  display: block;
  position: absolute;
  @apply dark:border-white transition-colors duration-300 w-[26px] h-[30px] min-[730px]:w-[50px] min-[730px]:h-[60px] left-[89px] min-[730px]:left-[76px] top-[-15px] min-[730px]:top-0;
}

.torso {
  width: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  left: 99px;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300 h-[55px] min-[730px]:h-[100px] top-[12px] min-[730px]:top-[59px];
}

.leftleg {
  width: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  left: 99px;
  transform: rotate(12deg);
  transform-origin: top;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300 h-[55px] min-[730px]:h-[100px] top-[64px] min-[730px]:top-[154px];
}

.rightleg {
  width: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  left: 99px;
  transform: rotate(-12deg);
  transform-origin: top;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300 h-[55px] min-[730px]:h-[100px] top-[64px] min-[730px]:top-[154px];
}

.leftarm {
  height: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  transform: rotate(-50deg);
  transform-origin: 100%;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300 w-[55px] min-[730px]:w-[100px] top-[20px] min-[730px]:top-[65px] left-[47px] min-[730px]:left-[2px];
}

.rightarm {
  width: 100px;
  height: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  left: 102px;
  transform: rotate(50deg);
  transform-origin: 0%;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300 w-[55px] min-[730px]:w-[100px] top-[20px] min-[730px]:top-[65px];
}

.leftfoot {
  width: 30px;
  height: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  transform: rotate(8deg);
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300 w-[17px] min-[730px]:w-[30px] top-[116px] min-[730px]:top-[249px] left-[76px] min-[730px]:left-[53px];
}

.rightfoot {
  width: 30px;
  height: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 249px;
  left: 121px;
  transform: rotate(-8deg);
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300 w-[17px] min-[730px]:w-[30px] top-[116px] min-[730px]:top-[249px] left-[111px] min-[730px]:left-[121px];
}


</style>
