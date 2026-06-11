<script lang="ts" setup>
const noresult = ref("");
const selectedRadio = ref(null);
const selectedDate = ref<string | null>(null);
const desword = ref("");
const searchline = ref();
const connectionError = ref(false);

import type { TDATA } from "~/models/TDATA";

const formattedSelectedDate = computed(() => {
  if (selectedDate.value != null) {
    const parts = selectedDate.value.split("/");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
});

useHead({
  title: "AVEDİKYAN - Günün Sözcüğü",
});

const dayData = reactive({
  DATE: formattedSelectedDate,
  WORD_ID: selectedRadio,
});

const responseData = ref<WORDOFTHEDAY[]>([]);
const showTable = ref(false);
const searchResponse = ref<TDATA[]>([]);

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
  "Cumartesi",
];

const monthSelection = ref(months[new Date().getMonth()]);
const yearSelection = ref(new Date().getFullYear());
const currentMonth = ref(months[new Date().getMonth()]);
const currentYear = ref(new Date().getFullYear());
const length = currentYear.value - 2025 + 2;
const years: number[] = Array.from({ length: length }, (_, i) => 2025 + i);

const getWords = async () => {
  try {
    const data = await fetchWithAuth<WORDOFTHEDAY[]>(
      `/api/account/get/getWordOfTheDay`,
      {
        method: "POST",

        body: JSON.stringify({
          start: startDateQ.value,
          end: endDateQ.value,
        }),
        headers: { "Content-Type": "application/json" },
      },
    );
    connectionError.value = false;
    responseData.value = data;
    showTable.value = true;
  } catch (err) {
    connectionError.value = true;

    return;
  }
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
  searchResponse.value = [];
  desword.value = "";

  searchline.value.clearThePage();

  await getWords();
};

interface WORDOFTHEDAY {
  DATE: string;
  WORD_ID: number;
  ARANAN: string;
  ID: number;
  AM: string;
  SIRA: number;
  ALAN2: string;
  ALAN1: string;
  ALAN3: string;
  AM1: string;
  TR1: string;
  TR2: string;
  TR3: string;
  TR4: string;
  TR5: string;
  TR6: string;
  OKUNUS: string;
}

const getIndex = (date: string) => {
  if (!responseData.value.length) return -1;
  return responseData.value.findIndex((item) => item.DATE === date);
};

const reset = async () => {
  currentMonth.value = monthSelection.value;
  currentYear.value = yearSelection.value;
  selectedDate.value = null;
  selectedRadio.value = null;
  searchResponse.value = [];
  desword.value = "";
  responseData.value = [];
  showTable.value = false;
  monthSelection.value = months[new Date().getMonth()];
  yearSelection.value = new Date().getFullYear();
  connectionError.value = false;
  searchline.value.clearThePage();
};

const submit = async () => {
  if (desword.value == "") {
    return;
  }

  try {
    const data = await fetchWithAuth(
      `/api/account/search/${encodeURIComponent(desword.value)}/searchingNoCheck`,
    );

    searchResponse.value = [];
    selectedRadio.value = null;

    if (data && Array.isArray(data) && data.length > 0) {
      searchResponse.value = data;
      noresult.value = "";
    } else {
      noresult.value = "Aradığınız sözcük bulunamadı.";
    }
  } catch (err) {
    noresult.value = "Bağlantı sorunu.";
    return;
  }
};

const wordInput = (data: string) => {
  desword.value = data;
};

const random = async () => {
  const { data, error } = await useFetch<TDATA[]>(`/api/get/getARandomWord`, {
    method: "GET",
  });
  if (error.value) {
    return;
  }
  searchResponse.value = [];

    if (data.value && data.value.length > 0) {
      searchResponse.value = data.value;
      desword.value = data.value[0].ARANAN ?? "";
    searchline.value.wordFromAbove(desword.value);
  } else {
  }
};

const deleteTheWord = async (date: string) => {
  try {
    const response = await fetchWithAuth<boolean>(
      `/api/account/update/deleteFromWordOfTheDay/${encodeURIComponent(date)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (response) {
      responseData.value[getIndex(date)].ARANAN = "";
      responseData.value[getIndex(date)].DATE = "";
    }
  } catch (error) {}
};

const save = async () => {
  if (dayData.DATE !== undefined && dayData.WORD_ID !== null) {
    try {
      const response = await fetchWithAuth<boolean>(
        `/api/account/update/addToDay`,
        {
          method: "POST",
          body: JSON.stringify(dayData),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response) {
        alert("Sonuç başarıyla eklendi.");
        selectedDate.value = null;
        selectedRadio.value = null;
        searchResponse.value = [];
        desword.value = "";

        $bus.emit("clear-main-page");
        await getWords();
      }
    } catch (error) {
      alert("Bağlantı Sorunu");
    }
  }
};

const setSDate = (date: string) => {
  selectedDate.value = date;
};
const temp = ref<HTMLDivElement | null>(null);

const tempPanel = ref(false);
const tempAm = ref("");
const tempTR1 = ref("");
const tempTR4 = ref("");
const exportAsJpg = async () => {
  try {
    if (selectedDate.value) {
      tempAm.value =
        responseData.value[getIndex(selectedDate.value)].AM.slice(
          0,
          1,
        ).toUpperCase() +
        responseData.value[getIndex(selectedDate.value)].AM.slice(1);
      tempTR4.value =
        responseData.value[getIndex(selectedDate.value)].TR4.slice(
          0,
          1,
        ).toUpperCase() +
        responseData.value[getIndex(selectedDate.value)].TR4.slice(1);
      tempTR1.value =
        responseData.value[getIndex(selectedDate.value)].TR1.slice(
          0,
          1,
        ).toLocaleUpperCase("TR") +
        responseData.value[getIndex(selectedDate.value)].TR1.slice(1);
    }

    tempPanel.value = true;
    await nextTick();

    temp.value?.focus();

    const canvas = await html2canvas(image.value, { useCORS: true });
    const link = document.createElement("a");

    if (selectedDate.value)
      link.download = `${selectedDate.value}_${responseData.value[getIndex(selectedDate.value)].OKUNUS}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 1.0);

    link.click();

    tempPanel.value = false;
  } catch (error) {
    alert(
      "Şablonu oluşturmadan önce; sözcüğün İngilizcesinin, Türkçesinin, Ermenicesinin ve okunuşunun dolu olduğundan emin olun.",
    );
  }
};

import html2canvas from "html2canvas";

const image = ref();
</script>

<template>
  <div class="">
    <div
      v-if="selectedDate != null && responseData[getIndex(selectedDate)]"
      class="absolute sm:left-4 top-36 bg-black p-2 rounded-lg w-full sm:w-[600px] xl:w-auto"
    >
      <div class="flex justify-end">
        <button
          @click="selectedDate = null"
          class="bg-red-500 text-black size-8 hover:bg-white rounded-md"
        >
          X
        </button>
      </div>

      <div class="flex justify-center text-lg font-bold text-white">
        Seçilen Güne Kaydedilmiş Sözcük
      </div>
      <WordTable
        :responseData="[responseData[getIndex(selectedDate)]]"
        :class="'p-2 my-2 !w-full xl:!w-[345px]'"
      ></WordTable>

      <ButtonCustom
        @click="exportAsJpg"
        class="hover:bg-red-500 mx-auto block mt-4"
        text="Şablonu İndir"
      />
    </div>

    <LayoutTitle
      :showReset="true"
      @reset-clicked="reset"
      text="Günün Sözcüğü"
    ></LayoutTitle>

    <div class="flex items-center mb-1 mt-2">
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

          <ButtonCustom
            class="w-20"
            @click="list"
            text="Listele"
          />
        </div>
      </div>
    </div>

    <table
      class="lostTable mx-auto table-auto transition-colors duration-300 my-4 text-black dark:text-white"
      v-if="showTable"
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
              v-text="searchResponse[0].ARANAN"
            ></span>
            <span
              v-else-if="getIndex(dateObject.date) !== -1"
              v-text="responseData[getIndex(dateObject.date)].ARANAN"
            ></span>
          </td>
          <td class="max-h-[30px]">
            <button
              @click.stop="deleteTheWord(dateObject.date)"
              v-if="getIndex(dateObject.date) !== -1"
              class="flex items-center border border-black mx-auto transition-colors duration-300 size-[27px] justify-center rounded-md active:scale-95 bg-white hover:bg-red-500"
            >
              <svg
                fill="#000000"
                width="21px"
                height="21px"
                viewBox="0 0 32 32"
                version="1.1"
              >
                <path
                  d="M30 7.249h-5.598l-3.777-5.665c-0.137-0.202-0.366-0.334-0.625-0.334h-8c-0 0-0.001 0-0.001 0-0.259 0-0.487 0.131-0.621 0.331l-0.002 0.003-3.777 5.665h-5.599c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h3.315l1.938 21.319c0.036 0.384 0.356 0.682 0.747 0.682 0 0 0 0 0.001 0h16c0 0 0.001 0 0.001 0 0.39 0 0.71-0.298 0.745-0.679l0-0.003 1.938-21.319h3.316c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0zM12.401 2.75h7.196l2.999 4.499h-13.195zM23.314 29.25h-14.63l-1.863-20.5 18.358-0.001zM11 11.25c-0.414 0-0.75 0.336-0.75 0.75v0 14c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-14c-0-0.414-0.336-0.75-0.75-0.75v0zM16 11.25c-0.414 0-0.75 0.336-0.75 0.75v0 14c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-14c-0-0.414-0.336-0.75-0.75-0.75v0zM21 11.25c-0.414 0-0.75 0.336-0.75 0.75v0 14c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-14c-0-0.414-0.336-0.75-0.75-0.75v0z"
                ></path>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-show="selectedDate">
      <SearchLine
        @input-changed="wordInput"
        @submit-request="submit"
        @random-request="random"
        ref="searchline"
      ></SearchLine>

      <WordTable
        :responseData="searchResponse"
        selectable
        v-model="selectedRadio"
        valueKey="WORD_ID"
      />

      <div
        class="text-center text-lg"
        v-if="noresult != ''"
        v-text="noresult"
      ></div>

      <ButtonCustom
        class="mx-auto block mt-5"
        text="Kaydet"
        @click="save()"
      />
    </div>
  </div>

  <div
    v-if="connectionError && !responseData"
    class="text-3xl flex items-center justify-center text-white h-[85vh]"
  >
    Bağlantı Sorunu
  </div>

  <div
    class="flex justify-center mt-2 fixed -left-[9999px] top-0"
    v-if="tempPanel && responseData && selectedDate"
  >
    <div
      class="relative font-[Calibri] flex justify-center text-white"
      ref="image"
    >
      <img
        src="/wordday.jpg"
        class="min-w-[800px] min-h-[632px]"
        draggable="false"
      />
      <span
        class="absolute font-bold text-6xl top-40 transform text-center flex justify-center w-[736px]"
        v-text="tempAm"
      ></span>
      <span
        class="absolute text-4xl top-[320px] text-center flex justify-center w-[736px]"
        v-text="tempTR1"
      ></span>
      <span
        class="absolute text-4xl top-[426px] text-center flex justify-center w-[552px]"
        v-text="tempTR4"
      ></span>
      <span
        class="absolute text-3xl top-20 text-center flex justify-center w-[736px]"
        v-text="'(' + responseData[getIndex(selectedDate)].OKUNUS + ')'"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.lostTable td,
.lostTable tr,
.lostTable th {
  @apply border border-black dark:border-white text-center;
}
</style>
