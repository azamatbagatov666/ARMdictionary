<script lang="ts" setup>



</script>

<template>
<div class="flex items-center justify-center">
    <div class="p-8 border-2 border-black rounded-lg bg-white transition-colors duration-300">
    <div class="grid grid-rows-3 gap-5">
<ElementComponentsCustomInput class="h-14 border-t-0 border-x-0 rounded-none outline-none transition-colors duration-300 focus:border-black" autofocus :placeholder="'Kullanıcı Adı'"/>
<ElementComponentsCustomInput class="h-14 border-t-0 border-x-0 rounded-none outline-none transition-colors duration-300 focus:border-black" type="password" :placeholder="'Parola'"/>
<ElementComponentsCustomButton class="hover:bg-red-500" text="Giriş Yap"/>
</div>
</div>

</div>
</template>

<style scoped>
  .flex {
    height: 90vh;
  }

</style>
