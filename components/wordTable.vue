<script lang="ts" setup>
const props = defineProps(["responseData"]);
</script>

<template>
  <table
    class="border-2 border-black rounded-lg text-lg p-2 m-10 mx-auto block w-full sm:w-2/3 lg:w-1/2 bg-gray-200 dark:bg-[#101010] dark:border-white transition-colors duration-300 last:mb-6"
    v-for="item in props.responseData"
  >
  <tbody>
    <tr class="mb-3 flex flex-wrap py-1 pl-1">
      <td>
 <SVGAmFlag class="mr-2"/>
      </td>
      <td class="font-bold flex flex-wrap pr-3">
        <span class="text-red-500" v-text="item.am"></span>
        <span class="ml-1 font-normal" v-text="`(${item.okunus})`"></span>
      </td>
      <td class="pr-3" v-text="item.aM1"></td>
      <td class="pr-3" v-text="item.alaN2"></td>
      <td class="pr-3" v-text="item.alaN1"></td>
    </tr>
    <tr class="mb-3 flex flex-wrap py-1 pl-1">
      <td>
 <SVGTrFlag class="mr-2"/>

      </td>
      <td class="pr-3 font-bold text-red-500" v-text="item.tR1"></td>
      <td class="pr-3" v-text="item.tR2"></td>
      <td class="pr-3" v-text="item.tR3"></td>
    </tr>
    <tr class="mb-3 flex flex-wrap py-1 pl-1">
      <td>
 <SVGEnFlag class="mr-2"/>
      </td>
      <td class="pr-3 font-bold text-red-500" v-text="item.tR4"></td>
      <td class="pr-3" v-text="item.tR5"></td>
      <td class="pr-3" v-text="item.tR6"></td>
    </tr>
    </tbody>
  </table>

</template>

<style scoped>
/*a*/
</style>
