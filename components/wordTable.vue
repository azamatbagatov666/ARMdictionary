<script setup lang="ts">
import type { TDATA } from "~/models/TDATA";

type KeyOfTDATA = keyof TDATA;

const props = withDefaults(defineProps<{
  responseData: TDATA[];
  class?: string;
  selectable?: boolean;

  modelValue?: number | null;

  valueKey?: KeyOfTDATA;
}>(), {
  valueKey: "ID",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
  (e: "select", item: TDATA): void;
}>();

const getValue = (item: TDATA) => {
  const key = props.valueKey as KeyOfTDATA;
  return item[key] as number | null;
};

const onSelect = (item: TDATA) => {
  const value = getValue(item);

  if (value == null) return;

  emit("update:modelValue", value);
  emit("select", item);
};
</script>

<template>
  <div
    v-for="item in props.responseData"
    :key="item.WORD_ID"
    class="w-full sm:w-2/3 lg:w-1/2 frame text-lg p-3 mx-auto my-6 "
    :class="props.class"
  >
    <div v-if="selectable">
      <label>
        <input
          type="radio"
          :checked="modelValue === getValue(item)"
          @change="onSelect(item)"
        />
        <span class="ml-2 text-purple-500 font-bold"
          >Sözcüğü seçmek için tıklayın.</span
        >
      </label>
      <div
        class="h-10 text-purple-500 font-bold ml-[21px]"
        v-text="valueKey === 'ID'
          ? `Sonuç numarası: ${item.ID}`
          : `Sözcük numarası: ${item.WORD_ID}`"
      />
    </div>

    <!-- Armenian -->

    
    <div class="flex flex-wrap items-start gap-x-2">
      <SVGAmFlag class="shrink-0" />

      <div class="flex-1 min-w-0 meanings">
        <span class="font-bold text-red-500">
          {{ item.AM }}
        </span>
        <span class="!ml-0"> ({{ item.OKUNUS }}) </span>

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
