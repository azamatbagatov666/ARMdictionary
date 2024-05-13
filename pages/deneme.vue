<script setup lang="ts">
import { useUserStore } from "~/store/user.store";
const userStore = useUserStore();



const qwe = async () => {
  userStore.testLogin();
};
</script>

<template>
  <button @click="qwe()">sadasdasd</button>
</template>

<style scoped></style>
