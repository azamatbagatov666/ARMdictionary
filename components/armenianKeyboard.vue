<script lang="ts" setup>
const props = defineProps<{
  longPress?: boolean;
  punctuation?: boolean;
  spaceBar?: boolean;
  backSpace?: boolean;
  uppercase?: boolean;
  wordle?: boolean;
  usedLetters?: string[];
  correctLetters?: string[];
  consumedLetters?: string[];
  misplacedLetters?: string[];
  correctlyPlacedLetters?: string[];
}>();

const emit = defineEmits<{
  (e: "letter-pushed", data: string): void;
  (e: "backspace-clicked"): void;
  (e: "enter-clicked"): void;
}>();

const push = (letter: string) => {
  if (backspaceHoldTimer !== null) {
    clearTimeout(backspaceHoldTimer);
    backspaceHoldTimer = null;
  }
  emit("letter-pushed", letter);
};

let backspaceHoldTimer: NodeJS.Timeout | null = null;

const startBackspaceHold = () => {
  emit("backspace-clicked");

  backspaceHoldTimer = setTimeout(() => {
    backspaceHoldTimer = setInterval(backspace, 100);
  }, 333);
};

const stopBackspaceHold = () => {
  if (backspaceHoldTimer !== null) {
    clearTimeout(backspaceHoldTimer);
    backspaceHoldTimer = null;
  }
};

const backspace = () => {
  emit("backspace-clicked");
};

const enter = () => {
  emit("enter-clicked");
};

const lines = [
  ["ձ", "յ", "՝", "՛", "՞", "՜", "օ", "ռ", "ժ"],
  ["խ", "վ", "է", "ր", "դ", "ե", "ը", "ի", "ո", "բ", "չ", "ջ"],
  ["ա", "ս", "տ", "ֆ", "կ", "հ", "ճ", "ք", "լ", "թ", "փ"],
  ["զ", "ց", "գ", "ւ", "պ", "ն", "մ", "շ", "ղ", "ծ"],
];

const punctuationCharacters = ["՝", "՛", "՞", "՜"];
</script>

<template>
  <div :style="{
    '--key-bg': wordle ? '#818384' : '#3490dc',
    '--key-active': wordle ? '#818384' : '#99c7ed'
  }"
    class="w-full sm:w-[570px] inline-block left-1/2 -translate-x-1/2 relative border-2 border-black my-3 p-2 rounded-lg bg-gray-200 dark:bg-[#101010] select-none dark:border-white transition-colors duration-300">
    <div v-for="(line, lineIndex) in lines" :key="lineIndex" class="row">
      
      <button v-for="(letter, index) in line" :key="index" tabindex="-1" class="armenian-button" :class="{
        'opacity-0 pointer-events-none cursor-default':
          !punctuation && punctuationCharacters.includes(letter),
        'used-button': usedLetters && usedLetters.includes(letter),
        'consumed-button': consumedLetters && consumedLetters.includes(letter),
        'correct-button': correctLetters && correctLetters.includes(letter),
        'misplaced-button': misplacedLetters && misplacedLetters.includes(letter),
        'correctly-placed-button': correctlyPlacedLetters && correctlyPlacedLetters.includes(letter),
        'uppercase': uppercase
      }" v-text="letter" @click="push(letter)"></button>
          
    </div>
    <div class="flex justify-center">
      <button v-if="spaceBar" class="armenian-button !w-[210px] !h-[33px]" @click="push(' ')" v-text="'&lrm;'"></button>
      <button v-if="backSpace && longPress" class="armenian-button !h-[33px] !p-0" @mousedown="startBackspaceHold"
        @mouseup="stopBackspaceHold" v-text="'⌫'"></button>
          <button tabindex="-1" v-if="backSpace && !longPress" class="armenian-button !text-3xl !h-[33px] !pb-[10px] flex items-center justify-center" @click="enter"
        v-text="'⇨'"></button>    
        <button tabindex="-1" v-if="backSpace && !longPress" class="armenian-button !h-[33px] !p-0" @click="backspace"
        v-text="'⌫'"></button>

    </div>
  </div>
</template>

<style scoped>
.armenian-button {
  @apply size-[7.10%] p-1 m-[2px] sm:m-[5px] sm:size-[35px] sm:p-[10px];
  font-size: 16px;
  background-color: var(--key-bg);
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding-top: 5px;
  outline: 0;
}

.armenian-button:active {
  background-color: var(--key-active);
}

.row:first-child {
  @apply flex justify-center sm:block sm:translate-x-[70px];
}

.row:nth-child(3) {
  transform: translateX(0.5rem);
}

.row:nth-child(4) {
  transform: translateX(1rem);
  @apply inline ml-4;
}

.row:first-child .armenian-button:nth-child(n + 3) {
  transform: translateX(30px);
}

.row:first-child .armenian-button:nth-last-child(-n + 3) {
  @apply translate-x-[47px] sm:translate-x-[75px];
}

.used-button {
  background-color: #ff0000 !important;
}

.correct-button {
  background-color: green !important;
}

.consumed-button {
  background-color: #3a3a3c !important;
}

.misplaced-button {
  background-color: #b59f3b !important;
}
.correctly-placed-button {
  background-color: #538d4e !important;
}
</style>
