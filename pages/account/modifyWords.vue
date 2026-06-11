<script setup lang="ts">
const desword = ref("");
const noresult = ref("");
const wordToBeAdded = ref("");

import type { TDATA } from "~/models/TDATA";


const selectedItemId = ref<number | null>(null);
const selectedRadio = ref<number | null>(null);
const previousDesword = ref("");
const selectedListWord = ref<string[]>([]);

useHead({
  title: "AVEDİKYAN - Yönlendirme Ekle",
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
      (item) => !selectedListWord.value.includes(item),
    );
    selectedListWord.value = [];
  }
};

const responseData = ref<TDATA[]>([]);
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
responseData.value = [];
  selectedItemId.value = null;
  selectedRadio.value = null;
  selectedListWord.value = [];
  wordToBeAdded.value = "";
  idData.arananlar = [];

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
  idData.arananlar = [];
  wordToBeAdded.value = "";
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
  }
};

const idData = reactive({
  arananlar: [] as string[],
  DesiredID: selectedRadio,
});

const storeValues = async () => {
  if (confirm("Seçtiğiniz sözcükler bu sonuca eklenecktir, emin misiniz?")) {
    if (idData.DesiredID != null && idData.arananlar.length > 0) {
      const response = await fetchWithAuth<boolean>(
        `/api/account/update/addToId`,
        {
          method: "POST",
          body: JSON.stringify(idData),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response) {
        idData.arananlar = [];
        getAranan();
      }
    } else {
      window.alert(
        "Önce sonuç numarasını seçtiğinizden ve istediğiniz sözcükleri listeye eklediğinizden emin olun.",
      );
    }
  }
};

const { $bus } = useNuxtApp();

const resetData = () => {
  arananData.value = null;
responseData.value = [];
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
  <div>


      <LayoutTitle :showReset="true" @reset-clicked="resetData" text="Yönlendirme Ekle"></LayoutTitle>


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

<div v-if="arananData" class="px-4 py-6 text-white">
  <!-- Title -->


  <!-- Main layout -->
  <div
    class="flex flex-col gap-10
           md:flex-row md:justify-center lg:gap-10"
  >
    <!-- Result list -->
    <div class="lg:max-w-xs w-full">
        <div class="text-2xl mb-4 text-center sm:text-left">
    Bu sonucu veren sözcükler:
  </div>
      <ul class="list-disc list-inside text-lg space-y-1">
        <li
          v-for="(arananlar, index) in arananData"
          :key="index"
          v-text="arananlar"
        />
      </ul>
    </div>

    <!-- Add word -->
    <div class="w-full lg:max-w-sm flex flex-col gap-2">
      <InputCustom
        v-model="wordToBeAdded"
        class="w-full"
      />
      <ButtonCustom
        text="Ekle"
        class="w-fit self-center px-8"
        @click="appendToList"
      />
    </div>

    <!-- Select & delete -->
    <div class="w-full lg:max-w-sm flex flex-col gap-2">
      <select
        multiple
        size="8"
        v-model="selectedListWord"
        class="w-full text-black border border-black rounded
               max-h-48 overflow-auto"
      >
        <option
          v-for="item in idData.arananlar"
          :key="item"
          v-text="item"
        />
      </select>

      <ButtonCustom
        text="Sil"
        class="w-fit self-center px-8"
        @click="deleteFromList"
      />
    </div>
  </div>

  <!-- Save button -->
  <div class="mt-12">
    <ButtonCustom
      text="Değerleri Kaydet"
      class="block mx-auto w-fit "
      @click="storeValues"
    />
  </div>
</div>
    </div>
  </div>
</template>

<style scoped>
/*dd*/
</style>
