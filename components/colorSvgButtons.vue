<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";

const props = defineProps<{
  ariaLabel?: string;
  buttonText?: string;
  colour: keyof typeof colorMap;
}>();

const { width } = useWindowSize();

const emit = defineEmits<{
  (e: "button-clicked"): void;
}>();

const buttonClick = (event: Event) => {
  if (width.value >= 1024) {
    event.preventDefault();
  }
};

const colorMap = {
  blue: "bg-blue-600",
  red: "bg-red-600",
  purple: "bg-purple-600",
  green: "bg-green-600",
} as const;

const colorMapActive = {
  blue: "active:!bg-blue-600",
  red: "active:!bg-red-600",
  purple: "active:!bg-purple-600",
  green: "active:!bg-green-600",
} as const;

const colorMapHover = {
  blue: "[@media(hover:hover)_and_(pointer:fine)]:hover:!bg-blue-600",
  red: "[@media(hover:hover)_and_(pointer:fine)]:hover:!bg-red-600",
  purple: "[@media(hover:hover)_and_(pointer:fine)]:hover:!bg-purple-600",
  green: "[@media(hover:hover)_and_(pointer:fine)]:hover:!bg-green-600",
} as const;


</script>

<template>
  <button
    :aria-label="props.ariaLabel"
    :class="`${colorMapActive[props.colour]} svgButton  transition-transform h-12 w-28 frame origin-top-left active:scale-105 ${colorMapHover[props.colour]}`"
    @click="emit('button-clicked')"
    @mousedown="buttonClick"
  >
    <div class="flex items-center ml-[5px]">
      <div
        :class="`${colorMap[props.colour]} rounded-full size-9 flex items-center justify-center`"
      >
        <slot />
      </div>
      <div class="">
        <span
          class="w-[68px] pointer-events-none inline-block break-words leading-none transition-opacity dark:text-white"
          v-text="props.buttonText"
        ></span>
      </div>
    </div>
  </button>
</template>

<style scoped>

</style>
