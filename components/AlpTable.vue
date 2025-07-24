<script setup lang="ts">


const letters = [
  "Ա", "Բ", "Գ", "Դ", "Ե", "Զ", "Է", "Ը", "Թ", "Ժ",
  "Ի", "Լ", "Խ", "Ծ", "Կ", "Հ", "Ձ", "Ղ", "Ճ", "Մ",
  "Յ", "Ն", "Շ", "Ո", "Չ", "Պ", "Ջ", "Ռ", "Ս", "Վ",
  "Տ", "Ր", "Ց", "Ւ", "Փ", "Ք", "Օ", "Ֆ"
];


const lowLetters = [
  "ա", "բ", "գ", "դ", "ե", "զ", "է", "ը", "թ", "ժ",
  "ի", "լ", "խ", "ծ", "կ", "հ", "ձ", "ղ", "ճ", "մ",
  "յ", "ն", "շ", "ո", "չ", "պ", "ջ", "ռ", "ս", "վ",
  "տ", "ր", "ց", "ւ", "փ", "ք", "օ", "ֆ"
];

const transliterations = [
  "ayp", "pen", "kim", "ta", "yeç", "za", "e", "ıt", "to", "je",
  "ini", "lyun", "khe", "dza", "gen", "ho", "tsa", "ğad", "ce", "mem",
  "hi", "nu", "şa", "vo", "ça", "be", "çe", "ra", "se", "vev",
  "dyun", "re", "tso", "hyun", "pyur", "ke", "o", "fe"
];

const tTransliterations = [
  "a", "p", "k", "t", "y", "z", "e", "ı", "t", "j",
  "i", "l", "kh", "dz", "g", "h", "ts", "ğ", "c", "m",
  "h,y", "n", "ş", "o,v,vo", "ç", "b", "ç", "r", "s", "v",
  "d", "r", "ts", "v", "p", "k", "o", "f"
];

const showAlpTable = ref(false);

const closePanel = () => {
showAlpTable.value = false;
};

defineExpose({ closePanel })


</script>


<template>
  <div class="flex justify-center mt-2">
   

    <div @click="showAlpTable = !showAlpTable" class="maindiv hidden min-[722px]:block bg-gray-200 h-[38px] w-[360.94px] dark:bg-[#101010]  p-1 cursor-pointer rounded-lg border-2 border-black dark:border-white duration-300 select-none"
    :class="{'!h-[115px] lg:!h-[131px] !w-[942.75px] lg:w-[992.78px] !shadow-none no-translate' : showAlpTable}">
    
    <div class="mb-0.5  flex justify-center font-bold"><span v-text="$t('alpTable.tableTitle')"></span></div>
    <Transition>

      <table @click.stop v-show="showAlpTable" class="alpTable table-fixed text-xs lg:text-sm text-black dark:text-white transition-all !cursor-default"
      >
        <tr>
          <td v-for="(letter, index) in letters" class="w-6 text-center   dark:bg-[rgb(128,128,128)] bg-[#f2f2f2]"
            v-text="letter">
          </td>
        </tr>
        <tr>
          <td v-for="(letter) in lowLetters" class="w-6 text-center  bg-gray-300 dark:bg-[#262a2f]" v-text="letter">
          </td>
        </tr>
        <tr>
          <td v-for="(letter) in transliterations" class="w-6 text-center  dark:bg-[rgb(128,128,128)] bg-[#f2f2f2]"
            v-text="letter">
          </td>
        </tr>
        <tr class="">
          <td v-for="(letter, index) in tTransliterations" class="w-6 text-center  bg-gray-300 dark:bg-[#262a2f]"
            v-text="letter">
          </td>
        </tr>
      </table>
    </Transition>

    </div>

    <div @click="showAlpTable = !showAlpTable" class="maindiv min-[722px]:hidden bg-gray-200 h-[56.98px] w-[180.47px] dark:bg-[#101010]  p-1 cursor-pointer rounded-lg border-2 border-black dark:border-white transition-all duration-300 select-none"
    :class="{'!h-[968.12px] shadow-none no-translate' : showAlpTable}">
    <div  class="mb-0.5 font-bold flex justify-center text-sm"><span class="text-center" v-text="$t('alpTable.tableTitle')"></span></div>
    <Transition>

      <table @click.stop v-show="showAlpTable" class="alpTable mx-auto max-h-[913.33px] table-fixed text-sm text-black dark:text-white transition-all "
      >
        <tr v-for="letter, index in (letters)" class="h-6 odd:dark:bg-[rgb(128,128,128)] odd:bg-[#f2f2f2] even:bg-gray-300 even:dark:bg-[#262a2f]">
          <td  class="w-10 text-center"
            v-text="letters[index]">
          </td>
          <td  class="w-10 text-center "
          v-text="lowLetters[index]">
          </td>
          <td  class="w-10 text-center  "
          v-text="transliterations[index]">
          </td>
          <td  class="w-10 text-center  "
          v-text="tTransliterations[index]">
          </td>
        </tr>

      </table>
    </Transition>

    </div>

  </div>
</template>


<style scoped>
.maindiv:active:not(.no-translate) {
  @apply dark:!shadow-[0_5px_#666] !shadow-[0_5px_#262a2f] translate-y-1;
}

.maindiv {
  transition: height 0.3s, width 0.3s, background-color 0.3s;
  @apply dark:shadow-[0_9px_#999] shadow-[0_9px_black];

}

.alpTable td,
tr,
th {
  @apply border border-black dark:border-white;
}

.v-enter-active {
  transition-delay: 0.3s;

}
.v-leave-active {
  transition-delay: 0.0s;

}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
