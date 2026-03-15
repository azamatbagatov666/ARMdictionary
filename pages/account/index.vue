<script lang="ts" setup>
const { login } = useAuth()

const loginFailed = ref(false);
const formError = ref(false);


const username = ref("");
const password = ref("");

useHead({
  title: "AVEDİKYAN - Giriş Yap",
});

const handleLogin = async () => {
  loginFailed.value = false;
  formError.value = false;



  if (username.value != "" && password.value != ""){
    try {
  const ok = await login(username.value, password.value)
if(!ok){
      loginFailed.value = true

}
    } catch (error) {
      loginFailed.value = true
    }
  }
  else
    formError.value = true;

};




</script>

<template>
  <div>
    <div class="form flex items-center justify-center flex-wrap">
      <div class="p-8 border-2 border-black rounded-lg bg-white transition-colors duration-300">
        <div class="grid grid-rows-3 gap-5">
          <ElementComponentsCustomInput @keydown.enter="handleLogin"
            class="h-14 border-t-0 border-x-0 rounded-none outline-none transition-colors duration-300 focus:border-black"
            v-model="username" autofocus :placeholder="'Kullanıcı Adı'" />
          <ElementComponentsCustomInput @keydown.enter="handleLogin"
            class="h-14 border-t-0 border-x-0 rounded-none outline-none transition-colors duration-300 focus:border-black"
            v-model="password" type="password" :placeholder="'Parola'" />
          <ElementComponentsCustomButton class="hover:bg-red-500" text="Giriş Yap" @click="handleLogin()" />
        </div>
      </div>
      <div v-if="loginFailed" class="text-red-500  text-center font-bold absolute mt-64">Hatalı kullanacı adı veya parola.</div>
      <div v-if="formError" class="text-red-500  text-center font-bold absolute mt-64">Kullanacı adı veya parola boş olamaz.</div>

    </div>





  </div>
</template>

<style scoped>
.form {
  height: 90vh;
}
</style>
