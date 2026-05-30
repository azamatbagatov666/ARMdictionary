<script lang="ts" setup>
const props = defineProps(["responseData", "class"]);



</script>

<template>


<div
  v-for="item in props.responseData"
  class="w-full sm:w-2/3 lg:w-1/2 border-2 border-black dark:border-white rounded-lg bg-gray-200 dark:bg-[#101010] text-lg p-3 mx-auto my-6 transition-colors duration-300"
  :class="props.class"

>
  <!-- Armenian -->
  <div class="flex flex-wrap items-start gap-x-2">
    <SVGAmFlag class="shrink-0" />

    <div class="flex-1 min-w-0 meanings">
      <span class="font-bold text-red-500">
        {{ item.AM }}
      </span>
      <span class="!ml-0">
        ({{ item.OKUNUS }})
      </span>

      <span> {{ item.AM1 }}</span>
      <span> {{ item.ALAN2 }}</span>
      <span> {{ item.ALAN1 }}</span>
    </div>
  </div>

  <!-- Turkish -->
  <div class="flex flex-wrap items-start gap-x-2 mt-6">
    <SVGTrFlag class="shrink-0" />

    <div class="flex-1 min-w-0 meanings">
      <span class="font-bold text-red-500">
        {{ item.TR1 }}
      </span>

      <span> {{ item.TR2 }}</span>
      <span> {{ item.TR3 }}</span>
    </div>
  </div>

  <!-- English -->
  <div class="flex flex-wrap items-start gap-x-2 mt-6">
    <SVGEnFlag class="shrink-0" />

    <div class="flex-1 min-w-0 meanings">
      <span class="font-bold text-red-500">
        {{ item.TR4 }}
      </span>

      <span> {{ item.TR5 }}</span>
      <span> {{ item.TR6 }}</span>
    </div>
  </div>
</div>
</template>

<style scoped>

.meanings {
  white-space: normal !important;
  min-width: 0;
}

.meanings span {
  white-space: normal !important;
  overflow-wrap: normal;
  word-break: normal;
}

.meanings span + span::before {
  content: " ";
}

</style>
