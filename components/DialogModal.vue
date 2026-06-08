<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean;
    disableClose?: boolean;
    dialogueText?: string;
    width?: number;
  }>(),
  {
    disableClose: false,
    dialogueText: "",
  },
);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);

const isModalOpen = computed(
  () => props.open || props.dialogueText.trim() !== "",
);

const syncDialog = async () => {
  const dialog = dialogRef.value;
  if (!dialog) return;

  if (isModalOpen.value) {
    if (!dialog.open) dialog.showModal();

    await nextTick();

    const target = dialog.querySelector<HTMLElement>("[data-focus-target]");
    if (target) {
      target.focus();
      if (target instanceof HTMLInputElement) {
        target.select();
      }
    }
  } else if (dialog.open) {
    dialog.close();
  }
};

onMounted(() => {
  watch(isModalOpen, syncDialog, { immediate: true });
});

const requestClose = () => {
  if (!props.disableClose) {
    emit("close");
  }
};

const onCancel = (e: Event) => {
  e.preventDefault();

  if (!props.disableClose) {
    emit("close");
  }
};
</script>

<template>
  <dialog ref="dialogRef" class="modal outline-none px-1" @cancel="onCancel">
    <div
      class="modal-box frame !rounded-2xl !border max-h-[92vh] overflow-y-auto"
      :class="props.width ? '' : 'sm:w-96'"
      :style="
        props.width
          ? { width: `${props.width}px`, maxWidth: 'fit-content' }
          : undefined
      "
    >
      <button
        class="outline-none btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        :class="
          props.disableClose ? 'pointer-events-none blur-sm opacity-35' : ''
        "
        @click="requestClose"
      >
        ✕
      </button>

      <div
        class="mt-5 flex justify-center text-center"
        :class="
          props.disableClose
            ? 'pointer-events-none blur-sm opacity-35 select-none'
            : ''
        "
      >
        <div class="font-bold text-lg whitespace-break-spaces text-left">
          {{ props.dialogueText }}
        </div>

        <slot />
      </div>
    </div>

    <div class="modal-backdrop" @click="requestClose" />

    <div class="absolute inset-0 pointer-events-none">
      <div class="relative w-full h-full">
        <span
          v-if="props.disableClose"
          class="loading loading-spinner loading-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  </dialog>
</template>
<style scoped>
.label span {
  font-weight: bold;
}
</style>
