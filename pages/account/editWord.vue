<script setup lang="ts">
import { searchingnocheck } from "~/services/searchingNoCheck";
import { searchingById } from "~/services/searchingById";
import { saveChanges } from "~/services/saveChanges";

import { type TDATA } from "~/models/TDATA";

const desword = ref("");
const noresult = ref("");

const selectedItemId = ref(null);
const selectedRadio = ref(null);
const selectedIndex = ref<TDATA | null>(null);
const selectedBackup = ref<TDATA | null>(null);
const previousDesword = ref("");

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
  selectedIndex.value = null;
  previousDesword.value = desword.value;

  if (data && Array.isArray(data.value) && data.value.length > 0) {
    responseData.value = data.value;
    noresult.value = "";
  } else {
    noresult.value = "Aradığınız sözcük bulunamadı.";
  }
};

const getAranan = async (index: number) => {
  selectedItemId.value = selectedRadio.value;
  const { data } = await searchingById(selectedItemId.value!);

  if (data && Array.isArray(data.value) && data.value.length > 0) {
    arananData.value = data.value.map((item) => item.aranan);
  }
  selectedIndex.value = JSON.parse(JSON.stringify(responseData.value[index]));
  selectedBackup.value = JSON.parse(JSON.stringify(responseData.value[index]));
  responseData.value = [responseData.value[index]];

};

const trimStrings = (obj: Record<string, any>) => {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim();
    }
  }
};

const updateTheWord = () => {
  if (confirm("Sonuç belirlediğiniz şekilde düzenlenecektir, emin misiniz?")) {
    if (
      (selectedIndex.value["aranan"] &&
        selectedIndex.value["am"] &&
        selectedIndex.value["okunus"] &&
        selectedIndex.value["tr1"] &&
        selectedIndex.value["tr4"]) !== "" &&
      JSON.stringify(selectedBackup.value) !=
        JSON.stringify(selectedIndex.value)
    ) {
      if (selectedIndex.value !== null) {
        trimStrings(selectedIndex.value);
      }

      for (const key in selectedIndex.value) {
        if (
          selectedIndex.value[key] === "" &&
          selectedBackup.value[key] === (null || "")
        ) {
          selectedIndex.value[key] = selectedBackup.value[key];
        }
      }

      for (var key in selectedIndex.value) {
        //@ts-ignore
        if (selectedIndex.value[key] === "") {
          //@ts-ignore
          selectedIndex.value[key] = null;
        }
      }

      saveChanges(selectedIndex.value).then((response) => {
        if (response.ok) {
          alert("Sonuç başarıyla eklendi.");
        }
      });
    } else {
      alert(
        "Sonuçta bir değişiklik yaptığınızdan ve * ile işaretli alanları doldurdğunuzdan emin olun."
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
  previousDesword.value = "";
  noresult.value = "";
  selectedIndex.value = null;
  selectedBackup.value = null;
  desword.value = "";
  $bus.emit("clear-main-page");
};
</script>

<template>
  <div class="flex items-center mb-1 mt-2">
    <ElementComponentsReturnButton @click="resetData()" class="ml-2 absolute" />
    <div
      v-text="'Sonuç Düzenle'"
      class="bg-red-900 text-5xl text-center w-[500px] border-2 py-3 mx-auto inline-block border-black rounded-lg dark:border-white"
    ></div>
  </div>

  <div class="mb-12">
    <SearchLine
      v-if="!selectedIndex"
      @input-changed="wordInput"
      @submit-request="submit"
    ></SearchLine>

    <div v-if="selectedIndex"
      class="text-3xl flex justify-around mb-1">
  <span v-text="'Sonucun Şu Anki Hali'"></span>
  <span v-text="'Yerine Geçecek Yeni Sonuç'"></span>
  </div>

    <div class="flex justify-center w-full mb-1" :class="{'h-[400px]' : selectedIndex}">
      <div :class="{'w-full h-full' : selectedIndex}">
      <div v-for="(item, index) in responseData" :key="item.worD_ID" :class="{'h-full' : selectedIndex}">
        <table :class="{'!m-0' : selectedIndex}"
          class="border-2 border-black rounded-lg text-lg p-2 m-10 mx-auto block h-full w-full bg-gray-200 dark:bg-[#101010] dark:border-white"
          v-if="selectedRadio == null || selectedRadio == item.id"
        >
          <tr class="h-10">
            <td>
              <label class="ml-2">
                <input
                  type="radio"
                  name="wordSelection"
                  @change="getAranan(index)"
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
      </div>
    </div>

      <div v-if="selectedIndex" class="w-full h-full">
        <table
          class="border-2 border-black rounded-lg text-lg p-2 pt-[88px] mx-auto block w-full h-full bg-gray-200 dark:bg-[#101010] dark:border-white"
        >
          <tr class="mb-3 flex flex-wrap py-1 pl-1">
            <img class="w-9 h-9 mr-2" src="/flags/am-flag.png" />
            <td class="font-bold text-red-500 pr-3">
              <span v-text="selectedIndex.am"></span>
              <span
                class="ml-1 font-normal text-black dark:text-white"
                v-text="`(${selectedIndex.okunus})`"
              ></span>
            </td>
            <td class="pr-3" v-text="selectedIndex.aM1"></td>
            <td class="pr-3" v-text="selectedIndex.alaN2"></td>
            <td class="pr-3" v-text="selectedIndex.alaN1"></td>
          </tr>
          <tr class="mb-3 flex flex-wrap py-1 pl-1">
            <img class="w-9 h-9 mr-2" src="/flags/tr-flag.png" />
            <td
              class="pr-3 font-bold text-red-500"
              v-text="selectedIndex.tR1"
            ></td>
            <td class="pr-3" v-text="selectedIndex.tR2"></td>
            <td class="pr-3" v-text="selectedIndex.tR3"></td>
          </tr>
          <tr class="mb-3 flex flex-wrap py-1 pl-1">
            <img class="w-9 h-9 mr-2" src="/flags/eng-flag.png" />
            <td
              class="pr-3 font-bold text-red-500"
              v-text="selectedIndex.tR4"
            ></td>
            <td class="pr-3" v-text="selectedIndex.tR5"></td>
            <td class="pr-3" v-text="selectedIndex.tR6"></td>
          </tr>
        </table>
      </div>
    </div>

    <div v-if="selectedIndex" class="flex">
      <div>


      <div class="flex mt-2">
      <div>
        <label class="w-56 inline-block">Aranan sözcüğün Ermenicesi:<span style="color: red">*</span></label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="selectedIndex.am" type="text" />
      </div>
      <div>
        <label class="w-40 ml-2 inline-block">Kelimenin Okunuşu:<span style="color: red">*</span></label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="selectedIndex.okunus" type="text" />
      </div>
    </div>
    <div class="flex mt-2">

      <div>
        <label class="w-56 inline-block">Ermenice birinci anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="selectedIndex.aM1" type="text" />
      </div>
      <div>
        <label class="w-40 ml-2 inline-block">Ermenice ikinci anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="selectedIndex.alaN2" type="text" />
      </div>
      <div>
        <label class="w-44 ml-2 inline-block">Ermenice üçüncü anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="selectedIndex.alaN1" type="text" />
      </div>
    </div>
    <div class="flex mt-2">

      <div>
        <label class="w-56 inline-block">Aranan sözcüğün Türkçesi:<span style="color: red">*</span></label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="selectedIndex.tR1" type="text" />
      </div>
      <div>
        <label class="w-40 ml-2 inline-block">Türkçe birinci anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="selectedIndex.tR2" type="text" />
      </div>
      <div>
        <label class="w-44 ml-2 inline-block">Türkçe ikinci anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="selectedIndex.tR3" type="text" />
      </div>
    </div>
    <div class="flex mt-2">

      <div>
        <label class="w-56 inline-block">Aranan sözcüğün İngilizcesi:<span style="color: red">*</span></label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="selectedIndex.tR4" type="text" />
      </div>
      <div>
        <label class="w-40 ml-2 inline-block">İngilizce birinci anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="selectedIndex.tR5" type="text" />
      </div>
      <div>
        <label class="w-44 ml-2 inline-block">İngilizce ikinci anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="selectedIndex.tR6" type="text" />
      </div> 
    </div>

      </div>


  

      <div class="mx-auto h-0">
    <div class="text-2xl w-52">Bu sonucu veren sözcükler:</div>
    <ul class="list-disc text-lg w-52 pl-5">
      <li
        v-for="(arananlar, index) in arananData"
        :key="index"
        v-text="arananlar"
      ></li>
    </ul>
  </div>
    </div>

    <div
      style="font-size: larger"
      v-if="noresult != ''"
      v-text="noresult"
    ></div>
  </div>

  <ElementComponentsCustomButton
    @click="updateTheWord"
    v-if="selectedIndex"
    class="block mx-auto"
    text="Sonucu Güncelle"
  />


</template>

<style scoped>
/*dd*/
</style>
