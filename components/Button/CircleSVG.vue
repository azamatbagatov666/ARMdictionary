<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";



const emit = defineEmits<{
  (e: "button-clicked"): void;
}>();





</script>

<template>
 
             <button
              @click="emit('button-clicked')"
              class="rounded-full text-black border-gray-300 bg-white info active:!bg-[#ccc] text-3xl"
            >
                      <slot />

            </button>
</template>

<style scoped>

</style>
