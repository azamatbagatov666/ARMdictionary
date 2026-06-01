<script setup lang="ts">
useHead({
  title: "AVEDİKYAN - Yönlendirme/Sözcük Sil",
});

import type { TDATA } from "~/models/TDATA";


const desword = ref("");
const noresult = ref("");
const { $bus } = useNuxtApp();

const selectedItemId = ref<number | null>(null);
const selectedRadio = ref<number | null>(null);
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

    try {
    const data = await fetchWithAuth(
      `/api/account/search/${encodeURIComponent(desword.value)}/searchingNoCheck`,
    );

  arananData.value = null;
  responseData.value = null;
  selectedItemId.value = null;
  selectedRadio.value = null;
  selectedListWord.value = [];

  previousDesword.value = desword.value;

  if (data && Array.isArray(data) && data.length > 0) {
    responseData.value = data;
    noresult.value = "";
  } else {
    noresult.value = "Aradığınız sözcük bulunamadı.";
  }
  } catch (err) {
    noresult.value = "Bağlantı sorunu.";
    return;
  }




  

};

const onWordSelected = (item: TDATA) => {
  selectedItemId.value = item.ID ?? null;
  getAranan();
};

const getAranan = async () => {
  selectedItemId.value = selectedRadio.value;
  arananData.value = null;


    const data = await fetchWithAuth(
    `/api/account/search/${encodeURIComponent(selectedItemId.value!)}/searchById`,
    {
      method: "GET",
    },
  );

  if (data && Array.isArray(data) && data.length > 0) {
    arananData.value = data.map((item) => item.ARANAN);
  } else if (data && Array.isArray(data) && data.length == 0) {
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
        const response = await fetchWithAuth<boolean>(
          `/api/account/update/deleteAndMoveToTrash`,
          {
            method: "POST",
            body: JSON.stringify(idData),
            headers: { "Content-Type": "application/json" },
          },
        );
        if (response) {
          selectedListWord.value = [];
          await getAranan();
          window.alert(
            "Seçtiğiniz sözcükler bu sonuçtan başarıyla silinmiştir.",
          );
          if (arananData.value == "") {
            responseData.value = null;
          }
        } else {
        }
      } catch (error) {}
    } else {
      window.alert(
        "Herhangi bir seçim yapmadınız. Önce silinmesini istediğiniz sözükleri işaretleyin.",
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
  <div>
    <div class="grid gap-2 sm:flex items-center mb-1 mt-2">
      <ElementComponentsReturnButton
        @click="resetData()"
        class="ml-2 sm:absolute"
      />
      <div
        v-text="'Yönlendirme/Sözcük Sil'"
        class="text-white bg-red-900 text-4xl sm:text-5xl text-center sm:w-[550px] border-2 p-3 mx-auto inline-block border-black rounded-lg dark:border-white"
      ></div>
    </div>

    <div class="mb-12">
      <SearchLine
        @input-changed="wordInput"
        @submit-request="submit"
      ></SearchLine>

<WordTable
  :responseData="responseData"
  selectable
  v-model="selectedRadio"
  @select="onWordSelected"
/>



      <div
        class="text-center text-lg"
        v-if="noresult != ''"
        v-text="noresult"
      ></div>

      <div class=" p-2 text-white" v-if="arananData">
    <div class="flex justify-center">

        <ul class="list-none text-lg text-left inline-block">
          <div class="text-3xl mb-2">Bu sonucu veren sözcükler:</div>
          <li v-for="(arananlar, index) in arananData" :key="index">
            <label
              class="mx-auto pl-4"
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
          class="block mx-auto mt-5"
        />

      </div>

    </div>
  </div>
</template>

<style scoped>
/*dd*/
</style>
