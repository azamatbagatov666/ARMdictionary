<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";

const loginFailed = ref(false);
const formError = ref(false);

const userStore = useUserStore();

const username = ref("");
const password = ref("");

const login = async () => {
  loginFailed.value = false;
  formError.value = false;

  if (username.value != "" && password.value != ""){
    try {
      await userStore.login(username.value, password.value);
      navigateTo('/');
    } catch (error) {
      loginFailed.value = true
    }
  }
  else
    formError.value = true;

};

const isLogged = computed(() => userStore.state.user != undefined);
const showForm = ref(false);

onBeforeMount(() => {
  setTimeout(() => {
    if (isLogged.value) {
      navigateTo("/");
    } else {
      showForm.value = true;
    }
  }, 500);
});
</script>

<template>
  <div>
    <div class="form flex items-center justify-center flex-wrap" v-if="!isLogged && showForm">
      <div class="p-8 border-2 border-black rounded-lg bg-white transition-colors duration-300">
        <div class="grid grid-rows-3 gap-5">
          <ElementComponentsCustomInput @keydown.enter="login"
            class="h-14 border-t-0 border-x-0 rounded-none outline-none transition-colors duration-300 focus:border-black"
            v-model="username" autofocus :placeholder="'Kullanıcı Adı'" />
          <ElementComponentsCustomInput @keydown.enter="login"
            class="h-14 border-t-0 border-x-0 rounded-none outline-none transition-colors duration-300 focus:border-black"
            v-model="password" type="password" :placeholder="'Parola'" />
          <ElementComponentsCustomButton class="hover:bg-red-500" text="Giriş Yap" @click="login()" />
        </div>
      </div>
      <div v-if="loginFailed" class="text-red-500  text-center font-bold absolute mt-64">Hatalı kullanacı adı veya parola.</div>
      <div v-if="formError" class="text-red-500  text-center font-bold absolute mt-64">Kullanacı adı veya parola boş olamaz.</div>

    </div>




    <div class="h-[90vh] flex items-center justify-center" v-else>
      <ElementComponentsLoadingAnimation />
    </div>
  </div>
</template>

<style scoped>
.form {
  height: 90vh;
}
</style>
