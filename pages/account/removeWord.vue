<script setup lang="ts">

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

const desword = ref("");
const noresult = ref("");
const { $bus } = useNuxtApp();

const selectedItemId = ref(null);
const selectedRadio = ref(null);
const previousDesword = ref("");
const selectedListWord = ref<string[]>([]);

const wordInput = (data: string) => {
  desword.value = data;
};

const responseData = ref();
const arananData = ref();

const submit = async () => {
  if (desword.value == "" || desword.value == previousDesword.value) {
    return;
  }

  const { data, error } = await useFetch(
    `/api/search/${encodeURI(desword.value)}/searchingNoCheck`,
    {
      method: "GET",
      headers: {
        token: userStore.state.user!.token,
      },
    }
  );
  if (error.value) {
    noresult.value = "Bağlantı sorunu.";

    return;
  }
  arananData.value = null;
  responseData.value = null;
  selectedItemId.value = null;
  selectedRadio.value = null;
  selectedListWord.value = [];

  previousDesword.value = desword.value;

  if (data && Array.isArray(data.value) && data.value.length > 0) {
    responseData.value = data.value;
    noresult.value = "";
  } else {
    noresult.value = "Aradığınız sözcük bulunamadı.";
  }
};

const getAranan = async () => {
  selectedItemId.value = selectedRadio.value;
  arananData.value = null;
  const { data } = await useFetch(
    `/api/search/${encodeURI(selectedItemId.value!)}/searchById`,
    {
      method: "GET",
      headers: {
        token: userStore.state.user!.token,
      },
    }
  );



  if (data && Array.isArray(data.value) && data.value.length > 0) {
    arananData.value = data.value.map((item) => item.aranan);
  } else if (data && data.value?.length == 0) {
    arananData.value = null;
    responseData.value = null;
    selectedItemId.value = null;
    selectedRadio.value = null;
    selectedListWord.value = [];
    previousDesword.value = "";
    noresult.value = "";
  }
};

const idData = reactive({
  arananlar: selectedListWord,
  DesiredID: selectedRadio,
});

const deleteTheWords = async () => {
  if (confirm("Seçtiğiniz sözcükler bu sonuçtan silinecektir, emin misiniz?")) {
    if (idData.DesiredID && idData.arananlar.length > 0) {
      try {
        const response = await $fetch<boolean>(
          `/api/account/update/deleteAndMoveToTrash`,
          {
            method: "POST",
            headers: {
              token: userStore.state.user!.token,
            },
            body: idData,
          }
        );
        if (response) {
          selectedListWord.value = [];
          await getAranan();
          window.alert(
            "Seçtiğiniz sözcükler bu sonuçtan başarıyla silinmiştir."
          );
          if (arananData.value == "") {
            responseData.value = null;
          }
        } else {
        }
      } catch (error) {}
    } else {
      window.alert(
        "Herhangi bir seçim yapmadınız. Önce silinmesini istediğiniz sözükleri işaretleyin."
      );
    }
  }
};
const resetData = () => {
  arananData.value = null;
  responseData.value = null;
  selectedItemId.value = null;
  selectedRadio.value = null;
  selectedListWord.value = [];
  previousDesword.value = "";
  noresult.value = "";
  $bus.emit("clear-main-page");
  desword.value = "";
};
</script>

<template>
  <div v-if="isLogged">
    <div class="flex items-center mb-1 mt-2">
      <ElementComponentsReturnButton
        @click="resetData()"
        class="ml-2 absolute"
      />
      <div
        v-text="'Sözcük/Sonuç Sil'"
        class="bg-red-900 text-5xl text-center w-[500px] border-2 py-3 mx-auto inline-block border-black rounded-lg dark:border-white"
      ></div>
    </div>

    <div class="mb-12">
      <SearchLine
        @input-changed="wordInput"
        @submit-request="submit"
      ></SearchLine>

      <table
        class="border-2 border-black rounded-lg text-lg p-2 m-10 mx-auto block w-full sm:w-1/2 bg-gray-200 dark:bg-[#101010] dark:border-white"
        v-for="item in responseData"
        :key="item.worD_ID"
      >
        <tr class="h-10">
          <td>
            <label class="ml-2">
              <input
                type="radio"
                name="wordSelection"
                @change="getAranan()"
                v-model="selectedRadio"
                :value="item.id"
              />
              <span class="text-purple-500 font-bold"
                >Sözcüğü seçmek için tıklayın.</span
              >
            </label>
          </td>
        </tr>
        <tr
          class="h-10 text-purple-500 font-bold ml-2"
          v-text="`Sonuç numarası: ${item.id}`"
        ></tr>
        <tr class="mb-3 flex flex-wrap py-1 pl-1">
          <img class="w-9 h-9 mr-2" src="/flags/am-flag.png" draggable="false"/>
          <td class="font-bold text-red-500 pr-3">
            <span v-text="item.am"></span>
            <span
              class="ml-1 font-normal text-black dark:text-white"
              v-text="`(${item.okunus})`"
            ></span>
          </td>
          <td class="pr-3" v-text="item.aM1"></td>
          <td class="pr-3" v-text="item.alaN2"></td>
          <td class="pr-3" v-text="item.alaN1"></td>
        </tr>
        <tr class="mb-3 flex flex-wrap py-1 pl-1">
          <img class="w-9 h-9 mr-2" src="/flags/tr-flag.png" draggable="false"/>
          <td class="pr-3 font-bold text-red-500" v-text="item.tR1"></td>
          <td class="pr-3" v-text="item.tR2"></td>
          <td class="pr-3" v-text="item.tR3"></td>
        </tr>
        <tr class="mb-3 flex flex-wrap py-1 pl-1">
          <img class="w-9 h-9 mr-2" src="/flags/eng-flag.png" draggable="false"/>
          <td class="pr-3 font-bold text-red-500" v-text="item.tR4"></td>
          <td class="pr-3" v-text="item.tR5"></td>
          <td class="pr-3" v-text="item.tR6"></td>
        </tr>
      </table>

      <div
        class="text-center text-lg"
        v-if="noresult != ''"
        v-text="noresult"
      ></div>

      <div class="text-center mb-4" v-if="arananData">
        <ul class="list-none text-lg text-left inline-block">
          <div class="text-3xl mb-2">Bu sonucu veren sözcükler:</div>
          <li v-for="(arananlar, index) in arananData" :key="index">
            <label
              class="mx-auto"
              :class="{ 'line-through': selectedListWord.includes(arananlar) }"
            >
              <input
                type="checkbox"
                v-model="selectedListWord"
                :value="arananlar"
                class="mr-2"
              />
              <span v-text="arananlar"></span>
            </label>
          </li>
        </ul>

        <ElementComponentsCustomButton
          @click="deleteTheWords"
          text="Seçilenleri Sil"
          class="block mx-auto mt-5"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/*dd*/
</style>
