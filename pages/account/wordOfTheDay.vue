<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";

const userStore = useUserStore();
const isLogged = computed(() => userStore.state.user != undefined);
const noresult = ref("");
const selectedRadio = ref(null);
const selectedDate = ref<string | null>(null);
const desword = ref("");
const searchline = ref();
const connectionError = ref(false);

const formattedSelectedDate = computed(() => {
  if (selectedDate.value != null) {
    const parts = selectedDate.value.split("/");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
});

useHead({
  title: "AVEDİKYAN - Günün Kelimesi",
});


const dayData = reactive({
  date: formattedSelectedDate,
  worD_ID: selectedRadio,
});

const responseData = ref();
const searchResponse = ref();

const months = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const days = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma ",
  "Cumartesi"
];

const monthSelection = ref(months[new Date().getMonth()]);
const yearSelection = ref(new Date().getFullYear());
const currentMonth = ref(months[new Date().getMonth()]);
const currentYear = ref(new Date().getFullYear());
const length = currentYear.value - 2025 + 2;
const years: number[] = Array.from({ length: length }, (_, i) => 2025 + i);

const getWords = async () => {
  const { data, error } = await useFetch(`/api/get/getWordOfTheDay`, {
    method: "POST",
    headers: {
      token: userStore.state.user!.token,
    },
    body: {
      start: startDateQ.value,
      end: endDateQ.value,
    },
  });
  if (error.value) {
    connectionError.value = true;
  }
  connectionError.value = false;
  responseData.value = data.value;
};
const daysInMonth = computed(() => {
  const monthIndex = months.indexOf(currentMonth.value);
  return new Date(currentYear.value, monthIndex + 1, 0).getDate();
});

const startDate = computed(() => {
  const monthIndex = months.indexOf(currentMonth.value);
  return new Date(currentYear.value, monthIndex, 1);
});

const endDate = computed(() => {
  const monthIndex = months.indexOf(currentMonth.value);
  return new Date(currentYear.value, monthIndex + 1, 0);
});

const dates = computed(() => {
  const generatedDates: { date: string; dayOfWeek: string }[] = [];
  const currentDate: Date = new Date(startDate.value);
  while (currentDate <= endDate.value) {
    generatedDates.push({
      date: currentDate.toLocaleDateString("en-GB"),
      dayOfWeek: days[currentDate.getDay()],
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return generatedDates;
});

const startDateQ = computed(() => {
  const monthIndex = months.indexOf(currentMonth.value);
  const formattedMonth = (monthIndex + 1).toString().padStart(2, "0");
  return `${currentYear.value}-${formattedMonth}-01`;
});

const endDateQ = computed(() => {
  const monthIndex = months.indexOf(currentMonth.value);
  const formattedMonth = (monthIndex + 1).toString().padStart(2, "0");
  return `${currentYear.value}-${formattedMonth}-${daysInMonth.value
    .toString()
    .padStart(2, "0")}`;
});

const { $bus } = useNuxtApp();

const list = async () => {
  currentMonth.value = monthSelection.value;
  currentYear.value = yearSelection.value;
  selectedDate.value = null;
  selectedRadio.value = null;
  searchResponse.value = undefined;
  desword.value = "";

  searchline.value.clearThePage();

  await getWords();
};

interface WORDOFTHEDAY {
  date: string;
  worD_ID: number;
  aranan: string;
  id: number;
  am: string;
  sira: number;
  alaN2: string;
  alaN1: string;
  alaN3: string;
  aM1: string;
  tR1: string;
  tR2: string;
  tR3: string;
  tR4: string;
  tR5: string;
  tR6: string;
  okunus: string;
}

const getIndex = (date: string) => {
  if (responseData)
    return responseData.value.findIndex(
      (item: WORDOFTHEDAY) => item.date === date
    );
};

const reset = async () => {
  currentMonth.value = monthSelection.value;
  currentYear.value = yearSelection.value;
  selectedDate.value = null;
  selectedRadio.value = null;
  searchResponse.value = undefined;
  desword.value = "";
  responseData.value = null;
  monthSelection.value = months[new Date().getMonth()];
  yearSelection.value = new Date().getFullYear();
  connectionError.value = false;
  searchline.value.clearThePage();
};

const submit = async () => {
  if (desword.value == "") {
    return;
  }

  const { data, error } = await useFetch(
    `/api/search/${encodeURIComponent(desword.value)}/searchingNoCheck`,
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
  searchResponse.value = null;
  selectedRadio.value = null;

  if (data && Array.isArray(data.value) && data.value.length > 0) {
    searchResponse.value = data.value;
    noresult.value = "";
  } else {
    noresult.value = "Aradığınız sözcük bulunamadı.";
  }
};

const wordInput = (data: string) => {
  desword.value = data;
};

const random = async () => {
  const { data, error } = await useFetch(`/api/get/getARandomWord`, {
    method: "GET",
  });
  if (error.value) {
    return;
  }
  searchResponse.value = null;

  if (data) {
    searchResponse.value = data.value;
    desword.value = searchResponse.value[0].aranan;
    searchline.value.wordFromAbove(desword.value);
  } else {
  }
};

const deleteTheWord = async (date: string) => {
  try {
    const response = await $fetch<boolean>(
      `/api/account/update/deleteFromWordOfTheDay/${encodeURIComponent(date)}`,
      {
        method: "POST",
        headers: {
          token: userStore.state.user!.token,
        },
      }
    );

    if (response) {
      responseData.value[getIndex(date)].aranan = "";
      responseData.value[getIndex(date)].date = "";
    }
  } catch (error) {}
};

const save = async () => {
  if (dayData.date !== undefined && dayData.worD_ID !== null) {
    try {
      const response = await $fetch<boolean>(`/api/account/update/addToDay`, {
        method: "POST",
        headers: {
          token: userStore.state.user!.token,
        },
        body: dayData,
      });

      if (response) {
        alert("Sonuç başarıyla eklendi.");
        selectedDate.value = null;
        selectedRadio.value = null;
        searchResponse.value = undefined;
        desword.value = "";

        $bus.emit("clear-main-page");
        await getWords();
      }
    } catch (error) {
      alert("Bağlantı Sorunu");
    }
  }
};

onBeforeMount(() => {
  setTimeout(() => {
    if (!isLogged.value) {
      navigateTo("/");
    }
  }, 500);
});

const setSDate = (date: string) => {
  selectedDate.value = date;

};
const temp = ref<HTMLDivElement | null>(null)

const tempPanel = ref(false);
const tempAm = ref("");
const tempTr1 = ref("");
const tempTr4 = ref("");
const openTemplatePanel = async () => {

  try {  
    if (selectedDate.value) {
    tempAm.value =
      responseData.value[getIndex(selectedDate.value)].am
        .slice(0, 1)
        .toUpperCase() +
      responseData.value[getIndex(selectedDate.value)].am.slice(1);
    tempTr4.value =
      responseData.value[getIndex(selectedDate.value)].tR4
        .slice(0, 1)
        .toUpperCase() +
      responseData.value[getIndex(selectedDate.value)].tR4.slice(1);
    tempTr1.value =
      responseData.value[getIndex(selectedDate.value)].tR1
        .slice(0, 1)
        .toLocaleUpperCase("TR") +
      responseData.value[getIndex(selectedDate.value)].tR1.slice(1);
  }


  tempPanel.value = true;
  await nextTick();

  temp.value?.focus();

  } catch (error) {
        alert("Şablonu oluşturmadan önce; sözcüğün İngilizcesinin, Türkçesinin, Ermenicesinin ve okunuşunun dolu olduğundan emin olun.");

  }

};

import html2canvas from "html2canvas";

const image = ref();

const exportAsJpg = async () => {
  const canvas = await html2canvas(image.value, { useCORS: true });
  const link = document.createElement("a");
  if(selectedDate.value)
  link.download = `${selectedDate.value}_${responseData.value[getIndex(selectedDate.value)].okunus}.jpg`;
  link.href = canvas.toDataURL("image/jpeg", 1.0); // quality 1.0 (max)
  link.click();
};
</script>

<template>
  <div v-if="isLogged" class="containers">
    <div
      v-if="selectedDate != null && responseData[getIndex(selectedDate)]"
      class="absolute top-36"
    >
      <div class="flex justify-center xl:text-lg font-bold">
        Seçilen Güne Kaydedilmiş Sözcük
      </div>
      <table
        class="border-2 border-black rounded-lg text-lg p-2 my-2 mx-auto block w-[256px] xl:w-[350px] min-[1750px]:w-[469px] bg-gray-200 dark:bg-[#101010] dark:border-white transition-colors duration-300"
      >
        <tbody>
          <tr class="mb-3 flex flex-wrap py-1 pl-1">
            <td>
              <img
                class="w-9 h-9 mr-2"
                src="/flags/am-flag.png"
                draggable="false"
              />
            </td>
            <td class="font-bold pr-3">
              <span
                class="text-red-500"
                v-text="responseData[getIndex(selectedDate)].am"
              ></span>
              <span
                class="ml-1 font-normal"
                v-text="`(${responseData[getIndex(selectedDate)].okunus})`"
              ></span>
            </td>
            <td
              class="pr-3"
              v-text="responseData[getIndex(selectedDate)].aM1"
            ></td>
            <td
              class="pr-3"
              v-text="responseData[getIndex(selectedDate)].alaN2"
            ></td>
            <td
              class="pr-3"
              v-text="responseData[getIndex(selectedDate)].alaN1"
            ></td>
          </tr>
          <tr class="mb-3 flex flex-wrap py-1 pl-1">
            <td>
              <img
                class="w-9 h-9 mr-2"
                src="/flags/tr-flag.png"
                draggable="false"
              />
            </td>
            <td
              class="pr-3 font-bold text-red-500"
              v-text="responseData[getIndex(selectedDate)].tR1"
            ></td>
            <td
              class="pr-3"
              v-text="responseData[getIndex(selectedDate)].tR2"
            ></td>
            <td
              class="pr-3"
              v-text="responseData[getIndex(selectedDate)].tR3"
            ></td>
          </tr>
          <tr class="mb-3 flex flex-wrap py-1 pl-1">
            <td>
              <img
                class="w-9 h-9 mr-2"
                src="/flags/eng-flag.png"
                draggable="false"
              />
            </td>
            <td
              class="pr-3 font-bold text-red-500"
              v-text="responseData[getIndex(selectedDate)].tR4"
            ></td>
            <td
              class="pr-3"
              v-text="responseData[getIndex(selectedDate)].tR5"
            ></td>
            <td
              class="pr-3"
              v-text="responseData[getIndex(selectedDate)].tR6"
            ></td>
          </tr>
        </tbody>
      </table>

      <ElementComponentsCustomButton
        @click="openTemplatePanel"
        class="hover:bg-red-500 mx-auto block mt-4"
        text="Şablonu Görüntüle"
      />
    </div>

    <div class="flex items-center mb-1 mt-2">
      <ElementComponentsReturnButton @click="reset()" class="ml-2 absolute" />

      <div class="block mx-auto">
        <div class="flex justify-center my-3 gap-1">
          <select
            id="month"
            class="text-black rounded-lg w-20 border border-black"
            v-model="monthSelection"
          >
            <option v-for="month in months" v-text="month"></option>
          </select>

          <select
            id="year"
            class="text-black rounded-lg w-20 border border-black"
            v-model="yearSelection"
          >
            <option v-for="year in years" v-text="year"></option>
          </select>

          <ElementComponentsCustomButton
            class="w-20"
            @click="list"
            text="Listele"
          />
        </div>
      </div>
    </div>

    <table
      class="lostTable mx-auto table-auto transition-colors duration-300 my-4 text-black dark:text-white"
      v-if="responseData"
    >
      <tbody>
        <tr class="bg-gray-300 dark:bg-[#262a2f]">
          <th class="w-36">Tarih</th>
          <th class="w-36">Gün</th>
          <th class="w-36 md:w-48 min-[1440px]:w-96">Sözcük</th>
          <th class="w-12">Sil</th>
        </tr>
        <tr
          v-for="dateObject in dates"
          class="cursor-pointer h-[30px] even:dark:bg-[rgb(128,128,128)] even:bg-[#f2f2f2] odd:bg-gray-300 odd:dark:bg-[#262a2f]"
          :class="{
            'dark:!bg-green-500 !bg-[rgb(255,165,100)]':
              selectedDate == dateObject.date,
          }"
          @click="setSDate(dateObject.date)"
        >
          <td v-text="dateObject.date"></td>
          <td v-text="dateObject.dayOfWeek"></td>
          <td>
            <span
              v-if="
                selectedDate == dateObject.date &&
                searchResponse &&
                selectedRadio
              "
              v-text="searchResponse[0].aranan"
            ></span>
            <span
              v-else-if="getIndex(dateObject.date) !== -1"
              v-text="responseData[getIndex(dateObject.date)].aranan"
            ></span>
          </td>
          <td class="max-h-[30px]">
            <button @click.stop="deleteTheWord(dateObject.date)" class="flex items-center mx-auto transition-colors duration-300  rounded-md active:scale-95 bg-white hover:bg-red-500">
            <img
              src="/trash.png"
              v-if="getIndex(dateObject.date) !== -1"
              class="size-[27px] "
              draggable="false"
            />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-show="selectedDate"
      class="mb-12"
      :class="{ 'mb-80': !searchResponse }"
    >
      <SearchLine
        @input-changed="wordInput"
        @submit-request="submit"
        @random-request="random"
        ref="searchline"
      ></SearchLine>

      <table
        class="border-2 border-black rounded-lg text-lg p-2 m-10 mx-auto block w-full sm:w-1/2 bg-gray-200 dark:bg-[#101010] dark:border-white"
        v-for="item in searchResponse"
        :key="item.worD_ID"
      >
        <tbody>
          <tr class="h-10">
            <td>
              <label class="ml-2">
                <input
                  type="radio"
                  name="wordSelection"
                  v-model="selectedRadio"
                  :value="item.worD_ID"
                />
                <span class="text-purple-500 font-bold"
                  >Sözcüğü seçmek için tıklayın.</span
                >
              </label>
            </td>
          </tr>
          <tr
            class="h-10 text-purple-500 font-bold ml-2"
            v-text="`Sözcük numarası: ${item.worD_ID}`"
          ></tr>
          <tr class="mb-3 flex flex-wrap py-1 pl-1">
            <td>
              <img
                class="w-9 h-9 mr-2"
                src="/flags/am-flag.png"
                draggable="false"
              />
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
              <img
                class="w-9 h-9 mr-2"
                src="/flags/tr-flag.png"
                draggable="false"
              />
            </td>
            <td class="pr-3 font-bold text-red-500" v-text="item.tR1"></td>
            <td class="pr-3" v-text="item.tR2"></td>
            <td class="pr-3" v-text="item.tR3"></td>
          </tr>
          <tr class="mb-3 flex flex-wrap py-1 pl-1">
            <td>
              <img
                class="w-9 h-9 mr-2"
                src="/flags/eng-flag.png"
                draggable="false"
              />
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

      <ElementComponentsCustomButton
        class="mx-auto block mt-5"
        text="Kaydet"
        @click="save()"
      />
    </div>
  </div>

  <div
    v-if="connectionError && !responseData"
    class="text-3xl flex items-center justify-center h-[85vh]"
  >
    Bağlantı Sorunu
  </div>

  <div
    v-if="tempPanel && responseData && selectedDate" @click.self="tempPanel = false"   @keyup.esc="tempPanel = false" tabindex="0" ref="temp"

    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 select-none"
  >
    <div class="bg-white p-6 rounded-lg w-[900px] h-[792px]">

            <div class="text-black text-5xl font-bold flex justify-end">
              <div class="border-black border px-[5px] pb-[2px] cursor-pointer rounded-lg hover:bg-red-500" v-text="'&#x2715'"  @click="tempPanel = false"></div>

      </div>

      <div class="flex justify-center mt-2">
        <div class="relative font-[Calibri] inline-block text-white" ref="image">
          <img src="/wordday.jpg" class="min-w-[800px] min-h-[632px]" draggable="false"/>
          <span
            class="absolute text-6xl top-20 transform left-8 w-[736px]"
            v-text="tempAm"
          ></span>
          <span
            class="absolute text-5xl top-[320px] left-8 w-[736px]"
            v-text="tempTr1"
          ></span>
          <span
            class="absolute text-5xl top-[426px] left-8 w-[552px]"
            v-text="tempTr4"
          ></span>
          <span
            class="absolute text-4xl top-56 left-[352px] w-[416px]"
            v-text="'(' + responseData[getIndex(selectedDate)].okunus + ')'"
          ></span>
        </div>
      </div>

      <ElementComponentsCustomButton
        @click="exportAsJpg"
        class="hover:bg-red-500 mx-auto block mt-1"
        text="İndir"
      />

      <ElementComponentsCustomButton
        @click="tempPanel = false"
        class="hover:bg-red-500 mx-auto block"
        text="Kapat"
      />


    </div>
  </div>
</template>

<style scoped>


.lostTable td,
.lostTable tr,
.lostTable th {
  @apply border border-black dark:border-white text-center;
}

.containers {
  padding-left: calc(100vw - 100%);
}

</style>
