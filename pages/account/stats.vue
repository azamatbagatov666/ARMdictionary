<script setup lang="ts">
import { type VISITS } from "~/models/VISITS";
const responseData = ref<VISITS[]>([]);
const dayData = ref<VISITS[]>([]);
const selectedDate = ref("")
const noData = ref(false)
const connectionError = ref(false);




import { useUserStore } from "~/store/user.store";
const userStore = useUserStore();
const isLogged = computed(() => userStore.state.user != undefined);

onBeforeMount(() => {
  setTimeout(() => {
    if (!isLogged.value) {
      navigateTo("/");
    }
  }, 500);
});

watch(
  () => isLogged.value,
  () => {
    getAll();
  },
);

onMounted(() => {
  if (isLogged.value) {
    getAll();
  }
})

const getAll = async () => {
  if (!isLogged) return;
  try {


  const data = await $fetch(`/api/get/getVisits/${"all"}`, {
    method: 'GET',
    headers: {
      token: userStore.state.user!.token
    }
  });
    if (data) {
  }

    if (data && Array.isArray(data) && data.length > 0) {
        responseData.value = data;

    }

  } catch (error) {
        connectionError.value = true

  }
};

const formattedSelectedDate = computed(() => {
  if (selectedDate.value != null) {
    const parts = selectedDate.value.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
});


const today = new Date().toISOString().split('T')[0]

const getTheDate = async () => {

  if (selectedDate.value && selectedDate.value <= today) {
     try {


  const data = await $fetch(`/api/get/getVisits/${formattedSelectedDate.value}`, {
    method: 'GET',
    headers: {
      token: userStore.state.user!.token
    }
  });
    if (data) {
  }

    if (data && Array.isArray(data) && data.length > 0) {
        dayData.value = data;

    }

    else {
      dayData.value = [];
      noData.value = true;
    }

  } catch (error) {
        connectionError.value = true

  }
  }
  else {
      alert("Lütfen geçerli bir tarih giriniz. En fazla dünün tarihini seçebilirsiniz.");

  }

 
};

</script>

<template>
    <div v-if="isLogged">
            <div class="h-[85vh] flex items-center justify-center"  v-if="!connectionError && responseData.length == 0">
<ElementComponentsLoadingAnimation/>
  </div>
      <div v-else-if="connectionError" class="text-3xl flex items-center justify-center h-[85vh]">
        Bağlantı Sorunu
      </div>
  <div v-else>
<div v-if="responseData.length > 0">
      <div class="font-bold text-2xl flex justify-center mt-8">Toplam İstatistikler</div>
  <div class="flex justify-center mt-2">
<table class="border table-auto">
  <tbody>
    <tr class="bg-gray-300 dark:bg-[#262a2f]">
      <th :colspan="2">Ülke / Cihaz</th>
      
      <th>Ziyaret Eden Kişi Sayısı</th>
    </tr>
    <tr v-for="(item) in responseData" class="even:dark:bg-[rgb(128,128,128)] even:bg-[#f2f2f2] odd:bg-gray-300 odd:dark:bg-[#262a2f]">
      
      <th v-if="(item.country == '' && item.device == '')" :colspan="2" v-text="'Toplam'" :class="{'bg-black text-lg' : item.country != ''}"></th>
      <th v-else-if="(item.country == '' && item.device == '') || item.device == ''" :colspan="2" v-text="item.country" :class="{'bg-black text-lg' : item.country != ''}"></th>

      <th :colspan="2" v-if="item.country != '' && item.device != ''" class="text-sm" v-text="item.device"></th>
      <th v-else-if="item.country == '' && item.device != ''" :colspan="2" v-text="item.device"></th>

      <th v-text="item.visit_count"></th>
    </tr>
  </tbody>
</table>



</div>
</div>
      <div class="font-bold text-2xl flex justify-center mt-8">Güne Göre İstatistikler</div>

  <div class="flex justify-center mt-2 ">
    <div class="grid grid-flow-col gap-4 items-center">
    <input 
      type="date"
      v-model="selectedDate"
            :max="today"

      class="border rounded text-black p-2 mt-1"
    />


  <ElementComponentsCustomButton @click="getTheDate" :text="'Günün Verilerini Getir'"/>

  </div>



  </div>
      <div class="flex justify-center mt-4" v-if="dayData.length > 0">

<table class="border table-auto">
  <tbody>
    <tr class="bg-gray-300 dark:bg-[#262a2f]">
      <th :colspan="2">Ülke / Cihaz</th>
      
      <th>Ziyaret Eden Kişi Sayısı</th>
    </tr>
    <tr v-for="(item) in dayData" class="even:dark:bg-[rgb(128,128,128)] even:bg-[#f2f2f2] odd:bg-gray-300 odd:dark:bg-[#262a2f]">
      
      <th v-if="(item.country == '' && item.device == '')" :colspan="2" v-text="'Toplam'" :class="{'bg-black text-lg' : item.country != ''}"></th>
      <th v-else-if="(item.country == '' && item.device == '') || item.device == ''" :colspan="2" v-text="item.country" :class="{'bg-black text-lg' : item.country != ''}"></th>

      <th :colspan="2" v-if="item.country != '' && item.device != ''" class="text-sm" v-text="item.device"></th>
      <th v-else-if="item.country == '' && item.device != ''" :colspan="2" v-text="item.device"></th>

      <th v-text="item.visit_count"></th>
    </tr>
  </tbody>
</table>
</div>
<div v-else-if="noData" class="font-bold text-lg flex justify-center mt-8">Seçtiğiniz güne ait kayıt bulunamamıştır.</div>
</div>
</div>
</template>

<style scoped>

table td,
tr,
th {
  @apply border border-black dark:border-white;
}

table th {
  @apply px-8
}
</style>
