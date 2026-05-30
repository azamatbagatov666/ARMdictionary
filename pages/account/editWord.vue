<script setup lang="ts">
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

useHead({
  title: "AVEDİKYAN - Sözcük Düzenle",
});

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
    selectedIndex.value = null;
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

const getAranan = async (index: number) => {
  selectedItemId.value = selectedRadio.value;
  const data = await fetchWithAuth(
    `/api/account/search/${encodeURIComponent(selectedItemId.value!)}/searchById`,
    {
      method: "GET",
    },
  );

  if (data && Array.isArray(data) && data.length > 0) {
    arananData.value = data.map((item) => item.ARANAN);
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

const updateTheWord = async () => {
  if (confirm("Sonuç belirlediğiniz şekilde düzenlenecektir, emin misiniz?")) {
    if (
      selectedIndex.value &&
      (selectedIndex.value["ARANAN"] &&
        selectedIndex.value["AM"] &&
        selectedIndex.value["OKUNUS"] &&
        selectedIndex.value["TR1"] &&
        selectedIndex.value["TR4"]) !== "" &&
      JSON.stringify(selectedBackup.value) !=
        JSON.stringify(selectedIndex.value)
    ) {
      if (selectedIndex.value !== null) {
        trimStrings(selectedIndex.value);
      }

      for (const key in selectedIndex.value) {
        if (
          selectedIndex.value &&
          selectedBackup.value &&
          selectedIndex.value[key as keyof TDATA] === "" &&
          selectedBackup.value[key as keyof TDATA] === (null || "")
        ) {
          selectedIndex.value[key as keyof TDATA] =
            selectedBackup.value[key as keyof TDATA];
        }
      }

      for (var key in selectedIndex.value) {
        //@ts-ignore
        if (selectedIndex.value[key] === "") {
          //@ts-ignore
          selectedIndex.value[key] = null;
        }
      }

      const response = await fetchWithAuth<boolean>(
        `/api/account/update/updateResult`,
        {
          method: "POST",
          body: JSON.stringify(selectedIndex.value),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response) {
        alert("Sonuç başarıyla eklendi.");
      }
    } else {
      alert(
        "Sonuçta bir değişiklik yaptığınızdan ve * ile işaretli alanları doldurdğunuzdan emin olun.",
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
  <div>
    <div class="grid gap-2 sm:flex items-center mb-1 mt-2">
      <ElementComponentsReturnButton
        @click="resetData()"
        class="ml-2 sm:absolute"
      />
      <div
        v-text="'Sözcük Düzenle'"
        class="bg-red-900 text-white text-5xl text-center sm:w-[500px] border-2 p-3 mx-auto inline-block border-black rounded-lg dark:border-white"
      ></div>
    </div>

    <div class="mb-12">
      <SearchLine
        v-if="!selectedIndex"
        @input-changed="wordInput"
        @submit-request="submit"
      ></SearchLine>

      <div
        v-if="selectedIndex"
        class="text-3xl flex justify-around mb-1 text-white"
      >
        <span v-text="'Sonucun Şu Anki Hali'"></span>
        <span v-text="'Yerine Geçecek Yeni Sonuç'"></span>
      </div>

      <div
        class="flex justify-center w-full mb-1"
        :class="{ 'h-[400px]': selectedIndex }"
      >
        <div :class="{ 'w-full h-full': selectedIndex }">
          <div
            v-for="(item, index) in responseData"
            :key="item.WORD_ID"
            :class="{ 'h-full': selectedIndex }"
          >
            <table
              :class="{ '!m-0': selectedIndex }"
              class="border-2 border-black rounded-lg text-lg p-2 m-10 mx-auto block h-full w-full bg-gray-200 dark:bg-[#101010] dark:border-white"
              v-if="selectedRadio == null || selectedRadio == item.ID"
            >
              <tbody>
                <tr class="h-10">
                  <td>
                    <label class="ml-2">
                      <input
                        type="radio"
                        name="wordSelection"
                        @change="getAranan(Number(index))"
                        v-model="selectedRadio"
                        :value="item.ID"
                      />
                      <span class="text-purple-500 font-bold"
                        >Sözcüğü seçmek için tıklayın.</span
                      >
                    </label>
                  </td>
                </tr>
                <tr
                  class="h-10 text-purple-500 font-bold ml-2"
                  v-text="`Sonuç numarası: ${item.ID}`"
                ></tr>
                <tr class="mb-3 flex flex-wrap py-1 pl-1">
                  <td>
                    <SVGAmFlag class="mr-2" />
                  </td>
                  <td class="font-bold text-red-500 pr-3">
                    <span v-text="item.AM"></span>
                    <span
                      class="ml-1 font-normal text-black dark:text-white"
                      v-text="`(${item.OKUNUS})`"
                    ></span>
                  </td>
                  <td class="pr-3" v-text="item.AM1"></td>
                  <td class="pr-3" v-text="item.ALAN2"></td>
                  <td class="pr-3" v-text="item.ALAN1"></td>
                </tr>
                <tr class="mb-3 flex flex-wrap py-1 pl-1">
                  <td>
                    <SVGTrFlag class="mr-2" />
                  </td>
                  <td
                    class="pr-3 font-bold text-red-500"
                    v-text="item.TR1"
                  ></td>
                  <td class="pr-3" v-text="item.TR2"></td>
                  <td class="pr-3" v-text="item.TR3"></td>
                </tr>
                <tr class="mb-3 flex flex-wrap py-1 pl-1">
                  <td>
                    <SVGEnFlag class="mr-2" />
                  </td>
                  <td
                    class="pr-3 font-bold text-red-500"
                    v-text="item.TR4"
                  ></td>
                  <td class="pr-3" v-text="item.TR5"></td>
                  <td class="pr-3" v-text="item.TR6"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="selectedIndex" class="w-full h-full">
          <table
            class="border-2 border-black rounded-lg text-lg p-2 pt-[88px] mx-auto block w-full h-full bg-gray-200 dark:bg-[#101010] dark:border-white"
          >
            <tbody>
              <tr class="mb-3 flex flex-wrap py-1 pl-1">
                <td>
                  <SVGAmFlag class="mr-2" />
                </td>
                <td class="font-bold text-red-500 pr-3">
                  <span v-text="selectedIndex.AM"></span>
                  <span
                    class="ml-1 font-normal text-black dark:text-white"
                    v-text="`(${selectedIndex.OKUNUS})`"
                  ></span>
                </td>
                <td class="pr-3" v-text="selectedIndex.AM1"></td>
                <td class="pr-3" v-text="selectedIndex.ALAN2"></td>
                <td class="pr-3" v-text="selectedIndex.ALAN1"></td>
              </tr>
              <tr class="mb-3 flex flex-wrap py-1 pl-1">
                <td>
                  <SVGTrFlag class="mr-2" />
                </td>
                <td
                  class="pr-3 font-bold text-red-500"
                  v-text="selectedIndex.TR1"
                ></td>
                <td class="pr-3" v-text="selectedIndex.TR2"></td>
                <td class="pr-3" v-text="selectedIndex.TR3"></td>
              </tr>
              <tr class="mb-3 flex flex-wrap py-1 pl-1">
                <td>
                  <SVGEnFlag class="mr-2" />
                </td>
                <td
                  class="pr-3 font-bold text-red-500"
                  v-text="selectedIndex.TR4"
                ></td>
                <td class="pr-3" v-text="selectedIndex.TR5"></td>
                <td class="pr-3" v-text="selectedIndex.TR6"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="selectedIndex" class="flex text-white">
        <div>
          <div class="flex mt-2">
            <div>
              <label class="w-56 inline-block"
                >Aranan sözcüğün Ermenicesi:<span
                  class="text-[red] font-bold text-lg"
                  >*</span
                ></label
              >
              <ElementComponentsCustomInput
                class="w-52 border border-black"
                v-model="selectedIndex.AM"
                type="text"
              />
            </div>
            <div>
              <label class="w-40 ml-2 inline-block"
                >Sözcüğün Okunuşu:<span class="text-[red] font-bold text-lg"
                  >*</span
                ></label
              >
              <ElementComponentsCustomInput
                class="w-52 border border-black"
                v-model="selectedIndex.OKUNUS"
                type="text"
              />
            </div>
          </div>
          <div class="flex mt-2">
            <div>
              <label class="w-56 inline-block">Ermenice birinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-52 border border-black"
                v-model="selectedIndex.AM1"
                type="text"
              />
            </div>
            <div>
              <label class="w-40 ml-2 inline-block"
                >Ermenice ikinci anlam:</label
              >
              <ElementComponentsCustomInput
                class="w-52 border border-black"
                v-model="selectedIndex.ALAN2"
                type="text"
              />
            </div>
            <div>
              <label class="w-44 ml-2 inline-block"
                >Ermenice üçüncü anlam:</label
              >
              <ElementComponentsCustomInput
                class="w-52 border border-black"
                v-model="selectedIndex.ALAN1"
                type="text"
              />
            </div>
          </div>
          <div class="flex mt-2">
            <div>
              <label class="w-56 inline-block"
                >Aranan sözcüğün Türkçesi:<span
                  class="text-[red] font-bold text-lg"
                  >*</span
                ></label
              >
              <ElementComponentsCustomInput
                class="w-52 border border-black"
                v-model="selectedIndex.TR1"
                type="text"
              />
            </div>
            <div>
              <label class="w-40 ml-2 inline-block"
                >Türkçe birinci anlam:</label
              >
              <ElementComponentsCustomInput
                class="w-52 border border-black"
                v-model="selectedIndex.TR2"
                type="text"
              />
            </div>
            <div>
              <label class="w-44 ml-2 inline-block">Türkçe ikinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-52 border border-black"
                v-model="selectedIndex.TR3"
                type="text"
              />
            </div>
          </div>
          <div class="flex mt-2">
            <div>
              <label class="w-56 inline-block"
                >Aranan sözcüğün İngilizcesi:<span
                  class="text-[red] font-bold text-lg"
                  >*</span
                ></label
              >
              <ElementComponentsCustomInput
                class="w-52 border border-black"
                v-model="selectedIndex.TR4"
                type="text"
              />
            </div>
            <div>
              <label class="w-40 ml-2 inline-block"
                >İngilizce birinci anlam:</label
              >
              <ElementComponentsCustomInput
                class="w-52 border border-black"
                v-model="selectedIndex.TR5"
                type="text"
              />
            </div>
            <div>
              <label class="w-44 ml-2 inline-block"
                >İngilizce ikinci anlam:</label
              >
              <ElementComponentsCustomInput
                class="w-52 border border-black"
                v-model="selectedIndex.TR6"
                type="text"
              />
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
        class="text-center text-lg"
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
  </div>
</template>

<style scoped>
/*dd*/
</style>
