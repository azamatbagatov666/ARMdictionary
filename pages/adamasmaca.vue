<script setup lang="ts">

const hangmanVis = ref(0);
const answer = ref();
const answerArray = ref<string[]>([]);
const guesses = ref<string[]>([]);
const connectionError = ref(false);
const won = ref();



const letters = ["է", "թ", "փ", "ձ", "ջ", "ր", "չ", "ճ", "ժ", "ծ",
  "ք", "ո", "ե", "ռ", "տ", "ը", "ւ", "ի", "օ", "պ", "ա", "ս", "դ", "ֆ",
  "գ", "հ", "յ", "կ", "լ", "խ", "զ", "ղ", "ց", "վ", "բ", "ն", "մ", "շ"];

const push = (letter: string) => {
  if (
    !guesses.value.includes(letter) &&
    hangmanVis.value < 8 &&
    !answerArray.value.every((value) => guesses.value.includes(value))
  ) {
    guesses.value.push(letter);
    if (answerArray.value.every((value) => guesses.value.includes(value))) {
      won.value = true;
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
  }
};

onBeforeMount(async () => {
  newGame();
});

const isUsedButton = (letter: string) => {
  return guesses.value.includes(letter);
};

const isCorrectButton = (letter: string) => {
  return answer.value.includes(letter) && guesses.value.includes(letter);
};

const newGame = async () => {
  try {
    const  data = await $fetch(`/api/get/getHangman`, {
    method: 'GET'
  })
    if (data) {
      responseData.value = data;
      answer.value = responseData.value[0].aranan;
      answerArray.value = answer.value.split("");
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
    <ElementComponentsLogoBanner/>

    <div
      class="h-[90vh] flex items-center justify-center"
      v-if="!answer && !connectionError"
    >
      <ElementComponentsLoadingAnimation />
    </div>
    <div class="sm:flex sm:justify-center">
      <div v-if="answer">
        <div
          class="flex justify-center px-2 h-[380px] w-full sm:w-[254px] mx-auto mt-2 border-2 border-black rounded-lg bg-gray-200 dark:bg-[#101010] select-none dark:border-white transition-colors duration-300"
        >
          <div class="hangman relative w-[250px] top-[10px]">
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

        <div class="text-center text-lg mt-1">
          <span v-text="8 - hangmanVis"></span
          ><span v-text="$t('adamAsmaca.rightsLeft')"></span>
        </div>
        <div class="text-center text-red-500 font-bold h-7 text-lg">
          <div v-show="won" v-text="$t('adamAsmaca.win')"></div>
          <div v-show="won == false" v-text="$t('adamAsmaca.lose')"></div>
        </div>

        <div class="h-16 flex justify-center">
          <div
            class="text-center px-3 pt-2 inline-block border-2 border-black rounded-lg bg-gray-200 dark:bg-[#101010] select-none dark:border-white transition-colors duration-300"
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

        <div class="keyboard" v-if="answer">
          <div
            class="w-full inline-block left-1/2 -translate-x-1/2 relative border-2 border-black my-2 p-2 rounded-lg bg-gray-200 dark:bg-[#101010] select-none dark:border-white transition-colors duration-300"
          >
            <div
              v-for="(letter, index) in letters"
              :key="index"
              class="flex justify-center"
            >
              <button
                v-if="index % 10 === 0"
                v-for="letter in letters.slice(index, index + 10)"
                class="armenian-button"
                :class="{
                  'used-button': isUsedButton(letter),
                  'correct-button': isCorrectButton(letter),
                }"
                v-text="letter"
                @click="push(letter)"
              ></button>
            </div>
          </div>
        </div>

        <ElementComponentsCustomButton
          class="mx-auto block w-28"
          @click="clear"
          v-text="$t('adamAsmaca.reset')"
        />
      </div>
      <div
        v-else-if="connectionError"
        class="text-3xl flex items-center justify-center h-[90vh] text-white font-bold"
        v-text="$t('adamAsmaca.noConnection')"
      ></div>

      <div v-if="won != null" class="mx-auto sm:w-0 sm:mx-0">
        <table
          class="border-2 border-black rounded-lg text-lg p-2 my-2 mx-auto block w-full sm:w-[469px] bg-gray-200 dark:bg-[#101010] dark:border-white transition-colors duration-300"
          v-for="item in responseData"
        >
          <tr class="mb-3 flex flex-wrap py-1 pl-1">
            <img class="w-9 h-9 mr-2" src="/flags/am-flag.png" draggable="false" />
            <td class="font-bold pr-3">
              <span class="text-red-500" v-text="item.am"></span>
              <span class="ml-1 font-normal" v-text="`(${item.okunus})`"></span>
            </td>
            <td class="pr-3" v-text="item.aM1"></td>
            <td class="pr-3" v-text="item.alaN2"></td>
            <td class="pr-3" v-text="item.alaN1"></td>
          </tr>
          <tr class="mb-3 flex flex-wrap py-1 pl-1">
            <img class="w-9 h-9 mr-2" src="/flags/tr-flag.png" draggable="false"/>
            <td class="pr-3 font-bold text-red-500" v-text="item.tR1"></td>
            <td class="pr-3" v-text="item.tR2"></td>
            <td class="pr-3" v-text="item.tR3"></td>
          </tr>
          <tr class="mb-3 flex flex-wrap py-1 pl-1">
            <img class="w-9 h-9 mr-2" src="/flags/eng-flag.png" draggable="false"/>
            <td class="pr-3 font-bold text-red-500" v-text="item.tR4"></td>
            <td class="pr-3" v-text="item.tR5"></td>
            <td class="pr-3" v-text="item.tR6"></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>

.used-button {
  background-color: #ff0000 !important;
}

.correct-button {
  background-color: green !important;
}

.armenian-button {
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
  height: 330px;
  border: 3px solid black;
  display: block;
  position: absolute;
  left: 47px;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300;
}

.gallowsrope {
  width: 2px;
  height: 40px;
  display: block;
  position: absolute;
  left: 170px;
  background-color: black;
  @apply dark:bg-white transition-colors duration-300;
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
  top: 330px;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300;
}

.head {
  width: 50px;
  height: 60px;
  border: 5px solid black;
  border-radius: 50%;
  display: block;
  position: absolute;
  left: 76px;
  @apply dark:border-white transition-colors duration-300;
}

.torso {
  width: 6px;
  height: 100px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 59px;
  left: 99px;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300;
}

.leftleg {
  width: 6px;
  height: 100px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 154px;
  left: 99px;
  transform: rotate(12deg);
  transform-origin: top;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300;
}

.rightleg {
  width: 6px;
  height: 100px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 154px;
  left: 99px;
  transform: rotate(-12deg);
  transform-origin: top;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300;
}

.leftarm {
  width: 100px;
  height: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 65px;
  left: 2px;
  transform: rotate(-50deg);
  transform-origin: 100%;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300;
}

.rightarm {
  width: 100px;
  height: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 65px;
  left: 102px;
  transform: rotate(50deg);
  transform-origin: 0%;
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300;
}

.leftfoot {
  width: 30px;
  height: 6px;
  border: 3px solid black;
  display: block;
  position: absolute;
  top: 249px;
  left: 53px;
  transform: rotate(8deg);
  background-color: black;
  @apply dark:border-white dark:bg-white transition-colors duration-300;
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
  @apply dark:border-white dark:bg-white transition-colors duration-300;
}
</style>
