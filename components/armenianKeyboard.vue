<script lang="ts" setup>

const emit = defineEmits<{
  (e: "letter-pushed", data: string): void;
  (e: "backspace-clicked"): void;
}>();



const letters = ["է", "թ", "փ", "ձ", "ջ", "ր", "չ", "ճ", "ժ", "ծ",
  "ք", "ո", "ե", "ռ", "տ", "ը", "ւ", "ի", "օ", "պ", "ա", "ս", "դ", "ֆ",
  "գ", "հ", "յ", "կ", "լ", "խ", "զ", "ղ", "ց", "վ", "բ", "ն", "մ", "շ"];

const push = (letter:string , event: Event) => {
  emit("letter-pushed", letter);
  event.preventDefault();
};


let backspaceHoldTimer: NodeJS.Timeout | null = null;

const startBackspaceHold = (event: Event) => {
  event.preventDefault();
  emit("backspace-clicked")  

  backspaceHoldTimer = setInterval(backspace, 100);

};

const stopBackspaceHold = (event: Event) => {
  event.preventDefault();


  clearInterval(backspaceHoldTimer as NodeJS.Timeout);
};

const backspace = () => {

  emit("backspace-clicked")

};





const buttonClick = (event: Event) => {
  event.preventDefault();
};

</script>

<template>
  <div class="inline-block left-1/2 -translate-x-1/2 relative border-2 border-black my-3 p-2 rounded-lg bg-gray-200 dark:bg-[#101010] dark:border-white">

    <div v-for="(letter, index) in letters" :key="index" class="text-center">
      <button v-if="index % 10 === 0" v-for="(letter) in letters.slice(index, index + 10)" class="armenian-button"
        v-text="letter" @click="push(letter, $event)"
        @mousedown="buttonClick"></button>
    </div>

    <div class="flex justify-center text-center">
      <button class="armenian-button !w-[210px]" @click="push(' ', $event)" @mousedown="buttonClick"></button>
      <button class="armenian-button" @mousedown="startBackspaceHold" @mouseup="stopBackspaceHold"
        v-text="'&#8592'"></button>
    </div>

  </div>
</template>

<style scoped>
.armenian-button {
  margin: 5px;
  padding: 10px;
  width: 35px;
  height: 35px;
  font-size: 16px;
  background-color: #3490dc;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding-top: 5px;
  
}

</style>
