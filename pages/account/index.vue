<script lang="ts" setup>
import { useUserStore } from '~/store/user.store';

const loginFailed = ref(false);

const userStore = useUserStore();

const username = ref("");
const password = ref("");

const login = async () => {
  const response = await userStore.login(username.value, password.value);
  if (response) {
    navigateTo('/');
  }
  else {
    loginFailed.value = true

  }
}

</script>

<template>
<div class="form flex items-center justify-center">
    <div class="p-8 border-2 border-black rounded-lg bg-white transition-colors duration-300">
    <div class="grid grid-rows-3 gap-5">
<ElementComponentsCustomInput @keydown.enter="login" class="h-14 border-t-0 border-x-0 rounded-none outline-none transition-colors duration-300 focus:border-black" v-model="username" autofocus :placeholder="'Kullanıcı Adı'"/>
<ElementComponentsCustomInput @keydown.enter="login" class="h-14 border-t-0 border-x-0 rounded-none outline-none transition-colors duration-300 focus:border-black" v-model="password" type="password" :placeholder="'Parola'"/>
<ElementComponentsCustomButton class="hover:bg-red-500" text="Giriş Yap" @click="login()"/>
</div>
</div>
<div class="text-red-500 text-center font-bold">Hatalı kullanacı adı veya parola.</div>


</div>

</template>

<style scoped>
  .form {
    height: 90vh;
  }

</style>
