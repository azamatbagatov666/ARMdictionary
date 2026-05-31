<script setup lang="ts">
import { type TDATA } from "~/models/TDATA";

const desword = ref("");
const noresult = ref("");

const selectedItemId = ref<number | null>(null);
const selectedRadio = ref<number | null>(null);
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

const onWordSelected = async (item: TDATA) => {
  const index = responseData.value.findIndex(
    (x: TDATA) => x.WORD_ID === item.WORD_ID,
  );

  if (index === -1) return;

  await getAranan(index);
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
          (selectedBackup.value[key as keyof TDATA] === null ||
            selectedBackup.value[key as keyof TDATA] === "")
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
        class="justify-center w-full mb-10"
        :class="{ 'block col-span-full gap-8 md:gap-4 md:flex': selectedIndex }"
      >
        <div :class="{ 'w-full h-full ': selectedIndex }">

            <span
              class="text-xl sm:text-3xl text-center block"
              v-if="selectedIndex"
              v-text="'Sonucun Şu Anki Hali'"
            ></span>

            <WordTable
              :responseData="responseData"
              selectable
              v-model="selectedRadio"
              @select="onWordSelected"
              :class="
                selectedRadio != null
                  ? '!w-full !h-[400px] !my-0 '
                  : ' !sm:w-2/3 !lg:w-1/2'
              "
            />
        </div>

        <div v-if="selectedIndex" class="w-full h-full">
          <span
            class="text-xl sm:text-3xl text-center block"
            v-if="selectedIndex"
            v-text="'Yerine Geçecek Yeni Sonuç'"
          ></span>

          <WordTable
            :responseData="[selectedIndex]"
            :class="'!w-full !h-[400px] !pt-[82px] !my-0'"
          />
        </div>
      </div>

      <div v-if="selectedIndex" class="px-2 sm:px-8 text-white place-center">
        <div class="w-full flex flex-col gap-4 theForm">
                 <div class="flex flex-col sm:flex-row gap-4">
            <div class=" min-w-0">
              <label class="block  ">
                Aranan sözcüğün Ermenicesi:<span
                  class="text-[red] font-bold text-lg"
                  >*</span
                >
              </label>
              <ElementComponentsCustomInput
                class="w-full md:w-80 border border-black"
                v-model="selectedIndex.AM"
                type="text"
              />
            </div>

            <div class=" min-w-0">
              <label class="block  ">
                Sözcüğün Okunuşu:<span class="text-[red] font-bold text-lg"
                  >*</span
                >
              </label>
              <ElementComponentsCustomInput
                class="w-full md:w-80 border border-black"
                v-model="selectedIndex.OKUNUS"
                type="text"
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 min-w-0">
              <label>Ermenice birinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="selectedIndex.AM1"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label>Ermenice ikinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="selectedIndex.ALAN2"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label>Ermenice üçüncü anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="selectedIndex.ALAN1"
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 min-w-0">
              <label>
                Aranan sözcüğün Türkçesi:<span
                  class="text-[red] font-bold text-lg"
                  >*</span
                >
              </label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="selectedIndex.TR1"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label>Türkçe birinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="selectedIndex.TR2"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label>Türkçe ikinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="selectedIndex.TR3"
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 min-w-0">
              <label>
                Aranan sözcüğün İngilizcesi:<span
                  class="text-[red] font-bold text-lg"
                  >*</span
                >
              </label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="selectedIndex.TR4"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label>İngilizce birinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="selectedIndex.TR5"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label>İngilizce ikinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="selectedIndex.TR6"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <div class="mt-6">
            <div class="text-xl lg:text-2xl mb-3">
              Bu sonucu veren sözcükler:
            </div>

            <ul class="list-disc text-base lg:text-lg pl-5 space-y-1">
              <li v-for="(arananlar, index) in arananData" :key="index">
                {{ arananlar }}
              </li>
            </ul>
          </div>
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
.theForm label {
  @apply text-sm md:text-base w-full block;
}
</style>
