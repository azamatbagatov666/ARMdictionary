<script lang="ts" setup>
import { type LOSTANDFOUND, type LAFRESPONSE } from "~/models/LOSTANDFOUND";
const responseData = ref<LOSTANDFOUND[]>([]);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = 100;
const selectedListWord = ref<string[]>([]);
const connectionError = ref(false);
const dataFetched = ref(false);
const dialogueOpen = ref(false);


const totalPages = computed(() => Math.ceil(totalCount.value / pageSize));


const pageButtonsToShow = computed(() => {
  const pages: (number | '...')[] = [];
  const total = totalPages.value;
  const current = currentPage.value;
  const windowSize = 5;

  if (total <= windowSize + 2) {
    // Small total → show everything
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  // Always show first page
  pages.push(1);

  let start = Math.max(2, current - 2);
  let end = Math.min(total - 1, current + 2);

  // Shift window when close to start
  if (current <= 3) {
    start = 2;
    end = 5;
  }

  // Shift window when close to end
  if (current >= total - 2) {
    start = total - 4;
    end = total - 1;
  }

  if (start > 2) pages.push('...');

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total - 1) pages.push('...');

  // Always show last page
  pages.push(total);

  return pages;
});

useHead({
  title: "AVEDİKYAN - Bulunamayan Sözcükler",
});

const screenHeight = ref(0);

onMounted(() => {
  refresh(1);
});

const deleteTheWords = async () => {
  if (
    confirm(
      "Seçtiğiniz sözcükler aranıp bulunamayan sözcükler listesinden silinecektir, emin misiniz?",
    )
  ) {
    if (selectedListWord.value.length > 0) {
      try {
        const response = await fetchWithAuth<boolean>(
          `/api/account/update/deletingFromLostAndFound`,
          {
            method: "POST",

            body: JSON.stringify(selectedListWord.value),

            headers: { "Content-Type": "application/json" },
          },
        );
        if (response) {
          selectedListWord.value = [];
          responseData.value = [];
          refresh(currentPage.value);
        }
      } catch (error) {}
    } else {
      window.alert(
        "Herhangi bir seçim yapmadınız. Önce silinmesini istediğiniz sözükleri işaretleyin.",
      );
    }
  }
};

const refresh = async (page: number) => {
  try {
    const data = await fetchWithAuth<LAFRESPONSE>(
      `/api/account/get/gettingSearchedOnes?page=${page}`,
      {
        method: "GET",
      },
    );

    dataFetched.value = true;

    if (data && typeof data == "object" && data.items.length > 0) {
      responseData.value = data.items;
      totalCount.value = data.totalCount;
      currentPage.value = data.currentPage;
      nextTick(() => {
        screenHeight.value = document.documentElement.scrollHeight;
      });
    }
  } catch (error) {
    connectionError.value = true;
  }
};

import { useWindowScroll, useWindowSize, useElementSize } from "@vueuse/core";
import { useTemplateRef } from "vue";

const { x, y } = useWindowScroll();
const { width, height } = useWindowSize();

const el = useTemplateRef("el");
const { height: elHeight } = useElementSize(el);

const scrollToTop = () => {
  scrollTo({ top: 0, left: 0, behavior: "smooth" });
};

const scrollToBottom = () => {
  scrollTo({ top: screenHeight.value, left: 0, behavior: "smooth" });
};

const appendOrRemove = (word: string) => {
  if (!selectedListWord.value.includes(word)) {
    selectedListWord.value.push(word);
  } else {
    selectedListWord.value = selectedListWord.value.filter(
      (item) => item !== word,
    );
  }
};
</script>

<template>
  <div>
    <LayoutTitle text="Bulunamayan Sözcükler"></LayoutTitle>

    <Transition name="fade" mode="out-in">
      <div
        class="button top-[30px] right-[30px] border-2 border-white"
        @click="scrollToTop"
        v-if="y > 300 && elHeight > height"
      >
        <div class="grid h-full place-content-center">
          <div class="flex gap-1">
            <div class="h-6 w-2 bg-white rotate-45"></div>
            <div class="h-6 w-2 bg-white -rotate-45"></div>
          </div>
        </div>
      </div>
    </Transition>
    <div class="mt-2 mb-12">
      <div
        class="h-[65dvh] flex items-center justify-center"
        v-if="!connectionError && !dataFetched"
      >
        <Loading />
      </div>

      <div v-if="responseData.length > 0" ref="el">
        <table class="lostTable mx-auto table-auto text-black dark:text-white">
          <tbody>
            <tr class="bg-gray-300 dark:bg-[#262a2f] cursor-default">
              <th></th>
              <th class="border">Bulunamayan Sözcük</th>
              <th class="border">Aranma Tarihi</th>
            </tr>
            <tr
              @click="appendOrRemove(item.ARANAN ?? '')"
              class="even:dark:bg-[rgb(128,128,128)] even:bg-[#f2f2f2] odd:bg-gray-300 odd:dark:bg-[#262a2f] cursor-pointer"
              :class="{
                'dark:!bg-[rgb(128,0,128)] !bg-[rgb(255,165,100)]':
                  selectedListWord.includes(item.ARANAN ?? ''),
              }"
              v-for="(item, index) in responseData"
              :key="item.ARANAN"
            >
              <td class="border text-center px-2" v-text="index + ((currentPage - 1) * pageSize) + 1"></td>
              <td
                class="border px-2 sm:w-[400px] max-w-[250px] sm:max-w-none break-words"
                v-text="item.ARANAN"
              ></td>
              <td class="border w-48 text-center" v-text="item.DATE"></td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-center gap-2 mt-6">
          <div className="join">
            <button  v-for="page in pageButtonsToShow"
    :key="page" class="join-item btn btn-sm w-9 sm:w-11 sm:btn-md" v-text="page"
        :class="{
      'font-bold !bg-gray-500 !text-white': page === currentPage,
      'pointer-events-none cursor-default': page === '...'
    }"
    @click="typeof page === 'number' && refresh(page)"
    ></button>

          </div>
        </div>

        <div class="flex justify-center mt-4">
          <div>
                   <div  class="flex items-center gap-2">
        <div class="text-white">Seçilen Sözcük Sayısı: {{ selectedListWord.length }}</div>
                 <ButtonCircleSVG class="rounded-lg p-1" @button-clicked="dialogueOpen = true ">
            <SVGGlass class="size-6" />
          </ButtonCircleSVG>
          </div>

        <ButtonCustom
          class="mt-5"
          text="Seçilenleri Listeden Sil"
          @click="deleteTheWords()"
        />
        </div>
        </div>

      </div>


      <div
        v-else-if="connectionError"
        class="text-3xl text-white flex items-center justify-center h-[85vh]"
      >
        Bağlantı Sorunu
      </div>

      <div
        v-else-if="responseData.length == 0 && dataFetched"
        class="text-3xl flex items-center justify-center h-[85vh]"
      >
        Şu anda, aranıp bulunamayan sözcükler listesinde herhangi bir sözcük
        yok.
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <div
        class="button bottom-[30px] right-[30px] border-2 border-white"
        @click="scrollToBottom"
        v-if="y < screenHeight - 1200 && elHeight > height"
      >
        <div class="grid h-full place-content-center">
          <div class="flex gap-1">
            <div class="h-6 w-2 bg-white -rotate-45"></div>
            <div class="h-6 w-2 bg-white rotate-45"></div>
          </div>
        </div>
      </div>
    </Transition>

      <DialogModal
    :open="dialogueOpen"
    @close="dialogueOpen = false "
  >
  
         <table class="lostTable mx-auto table-auto text-black dark:text-white">
          <tbody>
            <tr class="bg-gray-300 dark:bg-[#262a2f] cursor-default">
              <th class="min-w-7" ></th>
              <th class="border min-w-44">Bulunamayan Sözcük</th>
              <th class="border min-w-16">Kaldır</th>
            </tr>
            <tr
              class="even:dark:bg-[rgb(128,128,128)] even:bg-[#f2f2f2] odd:bg-gray-300 odd:dark:bg-[#262a2f]"

              v-for="(item, index) in selectedListWord"
              :key="item"
            >
              <td class="border text-center px-2" v-text="index + ((currentPage - 1) * pageSize) + 1"></td>
              <td
                class="border px-2 sm:w-[400px] max-w-[250px] sm:max-w-none break-words"
                v-text="item"
              ></td>
              <td class="border min-w-16 text-center">
                            <button
                            @click="appendOrRemove(item ?? '')"

              class="flex items-center  mx-auto  justify-center"
            >
<SVGCancel/>
            </button>

              </td>
            </tr>
          </tbody>
        </table>

  </DialogModal>
  </div>
</template>

<style scoped>
.lostTable td,
tr,
th {
  @apply border border-black dark:border-white;
}

.button {
  display: inline-block;
  background-color: #ff6f61;
  width: 50px;
  height: 50px;
  text-align: center;
  border-radius: 20px;
  position: fixed;
  z-index: 19;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (hover: hover) and (pointer: fine) {
  .button:hover {
    cursor: pointer;
    background-color: black;
  }
}
.button:active {
  background-color: #555;
}

.btn {
  background-color: white;
  color: black;
  transition: none;
}

</style>
