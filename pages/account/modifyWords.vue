<script setup lang="ts">
import { type TDATA } from "~/models/TDATA";

const desword = ref("");
const noresult = ref("");
const wordToBeAdded = ref("");

const selectedItemId = ref(null);
const selectedRadio = ref(null);
const previousDesword = ref("");
const selectedListWord = ref<string[]>([]);


const wordInput = (data: string) => {
  desword.value = data;
};


const appendToList = () => {
  if ((!arananData.value || !arananData.value.includes(wordToBeAdded.value)) && (!idData.arananlar || !idData.arananlar.includes(wordToBeAdded.value))) {

    idData.arananlar.push(wordToBeAdded.value);
    wordToBeAdded.value = '';
  }
  else {
    window.alert("Bu kelime zaten listede bulunuyor.");

  }
};

const deleteFromList = () => {

  if (selectedListWord.value.length > 0) {
    idData.arananlar = idData.arananlar.filter((item) => !selectedListWord.value.includes(item));
    selectedListWord.value = [];
  }
};

const responseData = ref();
const arananData = ref();

const submit = async () => {
  if (desword.value == "" || desword.value == previousDesword.value) {
    return;
  }

  const { data, error } = await useFetch<TDATA[]>(
    `https://localhost:7109/searchingnocheck/${desword.value}`
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
  wordToBeAdded.value = "";
  idData.arananlar = [];

  previousDesword.value = desword.value;


  if (data && Array.isArray(data.value) && data.value.length > 0 && data.value[0].aranan !== "NotFound") {
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
  const { data } = await useFetch(
    `https://localhost:7109/searchingbyid/${selectedItemId.value}`
  );

  arananData.value = data.value;
};




const idData = reactive({
  arananlar: [] as string[],
  DesiredID: selectedRadio,
});

const storeValues = () => {
  if (confirm('Seçtiğiniz sözcükler bu sonuca eklenecktir, emin misiniz?')) {
    if (idData.DesiredID != null && idData.arananlar.length > 0) {
      fetch("https://localhost:7109/AddToID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(idData),
      })
      .then(response => {
        if (response.ok) {
          idData.arananlar = [];
          getAranan();
        }
      })
    } else {
      window.alert("Önce sonuç numarasını seçtiğinizden ve istediğiniz sözcükleri listeye eklediğinizden emin olun.");
    }
  }
  
};






</script>

<template>
  <div class="mb-12">
    <title>Ermenice Sözlük</title>

    <form @submit="submit" onsubmit="return false">
      <SearchLine @input-changed="wordInput" @submit-request="submit"></SearchLine>
    </form>

    <table class="border border-solid border-gray-300 text-lg p-8 m-10 mx-auto w-1/2" v-for="item in responseData"
      :key="item.worD_ID">
      <tr class="h-10">
        <td>
          <label class="ml-2">
            <input type="radio" name="wordSelection" @change="getAranan()" v-model="selectedRadio" :value="item.id" />
            <span class="text-yellow-500 font-bold">Sözcüğü seçmek için tıklayın.</span>
          </label>
        </td>
      </tr>
      <tr class="h-10 text-yellow-500 font-bold ml-2" v-text="`Sonuç numarası: ${item.id}`"></tr>
      <tr class="mb-3 flex flex-wrap py-1 pl-1">
        <img class="w-9 h-9 mr-2" src="/flags/am-flag.png" />
        <td class="font-bold text-red-500 pr-3">
          <span v-text="item.am"></span>
          <span class="ml-1 font-normal text-black dark:text-white" v-text="`(${item.okunus})`"></span>
        </td>
        <td class="pr-3" v-text="item.aM1"></td>
        <td class="pr-3" v-text="item.alaN2"></td>
        <td class="pr-3" v-text="item.alaN1"></td>
      </tr>
      <tr class="mb-3 flex flex-wrap py-1 pl-1">
        <img class="w-9 h-9 mr-2" src="/flags/tr-flag.png" />
        <td class="pr-3 font-bold text-red-500" v-text="item.tR1"></td>
        <td class="pr-3" v-text="item.tR2"></td>
        <td class="pr-3" v-text="item.tR3"></td>
      </tr>
      <tr class="mb-3 flex flex-wrap py-1 pl-1">
        <img class="w-9 h-9 mr-2" src="/flags/eng-flag.png" />
        <td class="pr-3 font-bold text-red-500" v-text="item.tR4"></td>
        <td class="pr-3" v-text="item.tR5"></td>
        <td class="pr-3" v-text="item.tR6"></td>
      </tr>
    </table>

    <div style="font-size: larger" v-text="noresult"></div>

    <div class="grid grid-cols-3 mt-9">
      <div class="col-span-1 mx-auto">
        <div class="text-3xl">Bu sonucu veren sözcükler:</div>
        <ul class="list-disc" style="font-size: large">
          <li v-for="(arananlar, index) in arananData" :key="index" v-text="arananlar"></li>
        </ul>
      </div>




      <div class="mx-auto">
        <ElementComponentsCustomInput v-model="wordToBeAdded"/>
        <ElementComponentsCustomButton class="ml-1" text="Ekle" @click="appendToList"/>
      </div>

      <div class="mx-auto">
        <select multiple class="text-black border border-black w-96 overflow-auto" v-model="selectedListWord" size="9">
          <option v-for="item in idData.arananlar" :key="item" v-text="item"></option>
        </select>
        <ElementComponentsCustomButton class="block mx-auto" text="Sil" @click="deleteFromList"/>

      </div>
    </div>


    <ElementComponentsCustomButton class="block mx-auto" text="Değerleri Sakla" @click="storeValues"/>

  </div>
</template>

<style scoped>
/*dd*/
</style>
