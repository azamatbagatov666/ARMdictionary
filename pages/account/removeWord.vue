<script setup lang="ts">
import { searchingnocheck } from "~/services/searchingNoCheck";
import { searchingById } from "~/services/searchingById";
import { deleteAndMoveToTrash } from "~/services/deleteAndMoveToTrash";



const desword = ref("");
const noresult = ref("");

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

  const { data, error } = await searchingnocheck(desword.value);
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

  if (
    data &&
    Array.isArray(data.value) &&
    data.value.length > 0 &&
    data.value[0].aranan !== "NotFound"
  ) {
    responseData.value = data.value;
    noresult.value = "";
  } else {
    noresult.value = "Aradığınız sözcük bulunamadı.";
  }
};

const getAranan = async () => {
  selectedItemId.value = selectedRadio.value;
  arananData.value = null;
  const { data } = await searchingById(selectedItemId.value!);


  arananData.value = data.value;
};

const idData = reactive({
  arananlar: selectedListWord,
  DesiredID: selectedRadio,
});

const deleteTheWords = async () => {
  if (confirm("Seçtiğiniz sözcükler bu sonuçtan silinecektir, emin misiniz?")) {
    if (idData.DesiredID && idData.arananlar.length > 0) {
      try {
        const response = await deleteAndMoveToTrash(idData);
        if (response.ok) {
          selectedListWord.value = [];
          await getAranan();
          window.alert("Seçtiğiniz sözcükler bu sonuçtan başarıyla silinmiştir.")
          if (arananData.value == "") {
            responseData.value=null
          } 
        } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    } else {
      window.alert(
        "Herhangi bir seçim yapmadınız. Önce silinmesini istediğiniz sözükleri işaretleyin."
      );
    }
  }
};
</script>

<template>
  <div class="mb-12">
    <title>Ermenice Sözlük</title>

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
        <img class="w-9 h-9 mr-2" src="/flags/am-flag.png" />
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

    <div class="text-center mb-4">
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
    </div>

    <ElementComponentsCustomButton
      @click="deleteTheWords"
      text="Seçilenleri Sil"
      class="block mx-auto"
    />
  </div>
</template>

<style scoped>
/*dd*/
</style>
