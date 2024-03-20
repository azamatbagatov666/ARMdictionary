<script lang="ts" setup>
const name = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");

const login = () => {

  console.log(validateEmail(email.value))
};

const validateEmail = (email: string) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email.toLowerCase());
};



</script>

<template>
  <div class="form flex items-center justify-center">
    <div
      class="p-8 bg-gray-200 border-2 border-black rounded-lg dark:bg-[#101010] dark:border-white transition-colors duration-300"
    >
      <div class="grid gap-5">
        <div>
          <span class="w-40 inline-block">Adınız Soyadınız</span>
          <ElementComponentsCustomInput v-model="name" class="h-14 w-72" type=""/>
        </div>
        <div>
          <span class="w-40 inline-block">e-posta</span>
          <ElementComponentsCustomInput v-model="email" class="h-14 w-72"/>
        </div>
        <div>
          <span class="w-40 inline-block">Konu</span>
          <ElementComponentsCustomInput v-model="subject" class="h-14 w-72" />
        </div>
        <div class="flex">
          <span class="w-40 inline-block">Mesaj</span>
          <textarea v-model="message" class="bg-white p-2 rounded-lg text-black border-2 border-[rgb(128,128,128)] resize w-[500px]" name="" id="" cols="30" rows="10"></textarea>
        </div>
        <ElementComponentsCustomButton
          class="hover:bg-red-500 w-36 mx-auto block"
          text="Gönder"
          @click="login()"
        />

        <div class="bg-white text-black inline-block w-64 px-3 rounded-md font-bold  border-2 border-black  dark:border-white transition-colors duration-300">
          e-posta: <a class="text-[#0000EE] underline" href="mailto:info@avedikyan.com">info@avedikyan.com</a></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form {
  height: 90vh;
}

span{
  @apply font-bold
}
</style>
