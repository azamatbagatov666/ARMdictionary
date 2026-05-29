<script lang="ts" setup>
const props = defineProps(["responseData"]);
</script>

<template>


<div
  v-for="item in props.responseData"
  class="border-2 border-black dark:border-white rounded-lg bg-gray-200 dark:bg-[#101010] text-lg p-3 mx-auto my-6 w-full sm:w-2/3 lg:w-1/2 transition-colors duration-300"
>
  <!-- Armenian -->
  <div class="flex flex-wrap items-start gap-x-2">
    <SVGAmFlag class="shrink-0" />

    <div class="flex-1 min-w-0 meanings">
      <span class="font-bold text-red-500">
        {{ item.am }}
      </span>
      <span class="!ml-0">
        ({{ item.okunus }})
      </span>

      <span> {{ item.aM1 }}</span>
      <span> {{ item.alaN2 }}</span>
      <span> {{ item.alaN1 }}</span>
    </div>
  </div>

  <!-- Turkish -->
  <div class="flex flex-wrap items-start gap-x-2 mt-6">
    <SVGTrFlag class="shrink-0" />

    <div class="flex-1 min-w-0 meanings">
      <span class="font-bold text-red-500">
        {{ item.tR1 }}
      </span>

      <span> {{ item.tR2 }}</span>
      <span> {{ item.tR3 }}</span>
    </div>
  </div>

  <!-- English -->
  <div class="flex flex-wrap items-start gap-x-2 mt-6">
    <SVGEnFlag class="shrink-0" />

    <div class="flex-1 min-w-0 meanings">
      <span class="font-bold text-red-500">
        {{ item.tR4 }}
      </span>

      <span> {{ item.tR5 }}</span>
      <span> {{ item.tR6 }}</span>
    </div>
  </div>
</div>
</template>

<style scoped>

.meanings {
  white-space: normal;
  min-width: 0;
}

.meanings span {
  white-space: normal;
  margin-left: 0.5rem;

}

.meanings span:first-child {
  margin-left: 0;
}

</style>
