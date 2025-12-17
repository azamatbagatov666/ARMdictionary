<script setup lang="ts">


const desword = ref("");
const noresult = ref("");
const wordToBeAdded = ref("");

const selectedItemId = ref(null);
const selectedRadio = ref(null);
const previousDesword = ref("");
const selectedListWord = ref<string[]>([]);

import { useUserStore } from "~/store/user.store";
const userStore = useUserStore();
const isLogged = computed(() => userStore.state.user != undefined);

useHead({
  title: "AVEDİKYAN - Yönlendirme Ekle",
});

onBeforeMount(() => {
  setTimeout(() => {
    if (!isLogged.value) {
      navigateTo("/");
    }
  }, 500);
});

const wordInput = (data: string) => {
  desword.value = data;
};

const appendToList = () => {
  wordToBeAdded.value = wordToBeAdded.value.trim();

  if (wordToBeAdded.value != "") {
    if (
      (!arananData.value || !arananData.value.includes(wordToBeAdded.value)) &&
      (!idData.arananlar || !idData.arananlar.includes(wordToBeAdded.value))
    ) {
      idData.arananlar.push(wordToBeAdded.value);
      wordToBeAdded.value = "";
    } else {
      window.alert("Bu sözcük zaten listede bulunuyor.");
    }
  }
};

const deleteFromList = () => {
  if (selectedListWord.value.length > 0) {
    idData.arananlar = idData.arananlar.filter(
      (item) => !selectedListWord.value.includes(item)
    );
    selectedListWord.value = [];
  }
};

const responseData = ref();
const arananData = ref();

const submit = async () => {
  if (desword.value == "" || desword.value == previousDesword.value) {
    return;
  }


  const { data, error } = await useFetch(`/api/search/${encodeURIComponent(desword.value)}/searchingNoCheck`, {
    method: 'GET',
    headers: {
      token: userStore.state.user!.token
    }
  });
  if (error.value) {
    noresult.value = "Bağlantı sorunu.";

    return;
  }
  arananData.value = null;
  responseData.value = null;
  selectedItemId.value = null;
  selectedRadio.value = null;
  selectedListWord.value = [];
  wordToBeAdded.value = "";
  idData.arananlar = [];

  previousDesword.value = desword.value;

  if (data && Array.isArray(data.value) && data.value.length > 0) {
    responseData.value = data.value;
    noresult.value = "";
  } else {
    noresult.value = "Aradığınız sözcük bulunamadı.";
  }
};

const getAranan = async () => {
  idData.arananlar = [];
  wordToBeAdded.value = "";
  selectedItemId.value = selectedRadio.value;
  arananData.value = null;
  const data = await $fetch(`/api/search/${encodeURI(selectedItemId.value!)}/searchById`, {
    method: 'GET',
    headers: {
      token: userStore.state.user!.token
    }
  });

  if (data && Array.isArray(data) && data.length > 0) {
    arananData.value = data.map((item) => item.aranan);
  }
};

const idData = reactive({
  arananlar: [] as string[],
  DesiredID: selectedRadio,
});

const storeValues = async () => {
  if (confirm("Seçtiğiniz sözcükler bu sonuca eklenecktir, emin misiniz?")) {
    if (idData.DesiredID != null && idData.arananlar.length > 0) {

       const response = await $fetch<boolean>(
          `/api/account/update/addToId`,
          {
            method: "POST",
            headers: {
              token: userStore.state.user!.token,
            },
            body: idData,
          }
        );

        if (response) {
          idData.arananlar = [];
          getAranan();
        }
    } else {
      window.alert(
        "Önce sonuç numarasını seçtiğinizden ve istediğiniz sözcükleri listeye eklediğinizden emin olun."
      );
    }
  }
};

const { $bus } = useNuxtApp();

const resetData = () => {
  arananData.value = null;
  responseData.value = null;
  selectedItemId.value = null;
  selectedRadio.value = null;
  selectedListWord.value = [];
  previousDesword.value = "";
  noresult.value = "";
  $bus.emit("clear-main-page");
  wordToBeAdded.value = "";
  idData.arananlar = [];
  desword.value = "";

};
</script>

<template>
  <div v-if="isLogged">
    <div class="flex items-center mb-1 mt-2">
  <ElementComponentsReturnButton @click="resetData()" class="ml-2 absolute"/>
  <div v-text="'Yönlendirme Ekle'" class="text-white bg-red-900 text-5xl text-center w-[500px] border-2 py-3 mx-auto inline-block border-black rounded-lg dark:border-white"></div>
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
      <tbody>
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
          <td>
          <img class="w-9 h-9 mr-2" src="/flags/am-flag.png" draggable="false"/>
          </td>
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
          <td>
          <img class="w-9 h-9 mr-2" src="/flags/tr-flag.png" draggable="false"/>
          </td>
          <td class="pr-3 font-bold text-red-500" v-text="item.tR1"></td>
          <td class="pr-3" v-text="item.tR2"></td>
          <td class="pr-3" v-text="item.tR3"></td>
        </tr>
        <tr class="mb-3 flex flex-wrap py-1 pl-1">
          <td>
          <img class="w-9 h-9 mr-2" src="/flags/eng-flag.png" draggable="false"/>
          </td>
          <td class="pr-3 font-bold text-red-500" v-text="item.tR4"></td>
          <td class="pr-3" v-text="item.tR5"></td>
          <td class="pr-3" v-text="item.tR6"></td>
        </tr>
        </tbody>
      </table>

      <div
      class="text-center text-lg"
        v-if="noresult != ''"
        v-text="noresult"
      ></div>

      <div v-if="arananData">

      <div class="flex justify-between mt-9 text-white">
        <div class="col-span-1 mx-auto">
          <div class="text-3xl">Bu sonucu veren sözcükler:</div>
          <ul class="list-disc text-lg">
            <li
              v-for="(arananlar, index) in arananData"
              :key="index"
              v-text="arananlar"
            ></li>
          </ul>
        </div>

        <div class="mx-auto">
          <ElementComponentsCustomInput v-model="wordToBeAdded" />
          <ElementComponentsCustomButton
            class="ml-1"
            text="Ekle"
            @click="appendToList"
          />
        </div>

        <div class="mx-auto">
          <select
            multiple
            class="text-black border border-black sm:w-[150px] md:w-[250px] lg:w-[380px] overflow-auto"
            v-model="selectedListWord"
            size="9"
          >
            <option
              v-for="item in idData.arananlar"
              :key="item"
              v-text="item"
            ></option>
          </select>
          <ElementComponentsCustomButton
            class="block mx-auto"
            text="Sil"
            @click="deleteFromList"
          />
        </div>

   
      </div>
      <ElementComponentsCustomButton
        class="block mx-auto"
        text="Değerleri Kaydet"
        @click="storeValues"
      />



    </div>
  </div>
  </div>
</template>

<style scoped>
/*dd*/
</style>
