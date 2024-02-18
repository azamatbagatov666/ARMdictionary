<script lang="ts" setup>
const props = defineProps(['responseData']);

</script>

<template>
<table class="border-2 border-black rounded-lg text-lg p-2 m-10 mx-auto block w-full sm:w-1/2 bg-gray-200 dark:bg-[#101010] dark:border-white transition-colors duration-300" v-for="item in props.responseData">
    <tr class="mb-3 flex flex-wrap py-1 pl-1">
      <img class="w-9 h-9 mr-2" src="/flags/am-flag.png" />
      <td class="font-bold pr-3">
            <span class="text-red-500" v-text="item.am"></span>
            <span class="ml-1 font-normal" v-text="`(${item.okunus})`"></span>
          </td>
      <td class = "pr-3" v-text="item.aM1"></td>
      <td class = "pr-3" v-text="item.alaN2"></td>
      <td class = "pr-3" v-text="item.alaN1"></td>
    </tr>
    <tr class="mb-3 flex flex-wrap py-1 pl-1">
      <img class="w-9 h-9 mr-2" src="/flags/tr-flag.png" />
      <td class = "pr-3 font-bold text-red-500" v-text="item.tR1"></td>
      <td class = "pr-3" v-text="item.tR2"></td>
      <td class = "pr-3" v-text="item.tR3"></td>
    </tr>
    <tr class="mb-3 flex flex-wrap py-1 pl-1">
      <img class="w-9 h-9 mr-2" src="/flags/eng-flag.png" />
      <td class = "pr-3 font-bold text-red-500" v-text="item.tR4"></td>
      <td class = "pr-3" v-text="item.tR5"></td>
      <td class = "pr-3" v-text="item.tR6"></td>
    </tr>
  </table>
</template>


<style scoped>


/*a*/




</style>
    