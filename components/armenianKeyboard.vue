<script lang="ts" setup>

const emit = defineEmits<{
  (e: "letter-pushed", data: string): void;
  (e: "backspace-clicked"): void;
}>();



const letters = ["է", "թ", "փ", "ձ", "ջ", "ր", "չ", "ճ", "ժ", "ծ",
  "ք", "ո", "ե", "ռ", "տ", "ը", "ւ", "ի", "օ", "պ", "ա", "ս", "դ", "ֆ",
  "գ", "հ", "յ", "կ", "լ", "խ", "զ", "ղ", "ց", "վ", "բ", "ն", "մ", "շ"];

const push = (letter:string) => {
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


</script>

<template>
  <div class="w-full sm:w-max inline-block left-1/2 -translate-x-1/2 relative border-2 border-black my-3 p-2 rounded-lg bg-gray-200 dark:bg-[#101010] select-none dark:border-white transition-colors duration-300">

    <div v-for="(letter, index) in letters" :key="index" class="text-center">
      <button v-if="index % 10 === 0" v-for="(letter) in letters.slice(index, index + 10)" class="armenian-button"
        v-text="letter" @click="push(letter)"></button>
    </div>

    <div class="flex justify-center text-center">
      <button class="armenian-button !w-[210px] !h-[33px]" @click="push(' ')"></button>
      <button class="armenian-button" @mousedown="startBackspaceHold" @mouseup="stopBackspaceHold"
        v-text="'&#8592'"></button>
    </div>

  </div>
</template>

<style scoped>
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

</style>
