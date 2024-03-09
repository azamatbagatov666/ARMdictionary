<script lang="ts" setup>
import { gettingSearchedOnes } from "~/services/gettingSearchedOnes";
import { deletingFromLostAndFound } from "~/services/deletingFromLostAndFound";
import { type LOSTANDFOUND } from "~/models/LOSTANDFOUND";
const responseData = ref<LOSTANDFOUND[]>([]);

const selectedListWord = ref<string[]>([]);

const idData = reactive({
  arananlar: selectedListWord,
  DesiredID: 0,
});

const deleteTheWords = async () => {

  if (
    confirm(
      "Seçtiğiniz sözcükler aranıp bulunamayan sözcükler listesinden silinecektir, emin misiniz?"
    )
  ) {
    if (idData.arananlar.length > 0) {
      try {
        const response = await deletingFromLostAndFound(idData);

        if (response.ok) {
          selectAll.value = false;
          selectedListWord.value = [];
          responseData.value = [];
          refresh();
        } 
      } catch (error) {

      }
    } else {
      window.alert(
        "Herhangi bir seçim yapmadınız. Önce silinmesini istediğiniz sözükleri işaretleyin."
      );
    }
  }
};

onBeforeMount(async () => {
  refresh();
});

const refresh = async () => {
  try {
    const data = await gettingSearchedOnes();
    if (data && Array.isArray(data) && data.length > 0) {
      responseData.value = data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};



const shouldRenderTable = computed(() => responseData.value.length > 0);


const selectAll = ref(false);

const toggleSelectAll = () => {
  selectedListWord.value = selectAll.value
    ? (responseData.value
        .map((item) => item.aranan)
        .filter(Boolean) as string[])
    : [];
};

watch(selectedListWord, (newValue) => {
  selectAll.value =
    newValue.length === responseData.value.length &&
    responseData.value.length > 0;
});
</script>

<template>
  <ClientOnly>
  <div class="mt-2 mb-12">
    
      <div v-if="shouldRenderTable">
        <table class="lostTable mx-auto table-auto w-[50%]">
          <tr>
            <th class="text-center">
              <input
                type="checkbox"
                @change="toggleSelectAll"
                v-model="selectAll"
              />
            </th>
            <th></th>
            <th class="border">Bulunamayan Sözcük</th>
            <th class="border">Aranma Tarihi</th>
          </tr>
          <tr class="even:dark:bg-[rgb(128,128,128)] even:bg-[#f2f2f2]"
            :class="{
              'dark:!bg-[rgb(128,0,128)] !bg-[rgb(255,165,100)]': selectedListWord.includes(item.aranan ?? ''),
            }"
            v-for="(item, index) in responseData"
            :key="item.aranan"
          >
            <td class="border w-6 text-center">
              <input
                type="checkbox"
                v-model="selectedListWord"
                :value="item.aranan"
              />
            </td>
            <td class="border" v-text="index + 1"></td>
            <td class="border" v-text="item.aranan"></td>
            <td class="border" v-text="item.date"></td>
          </tr>
        </table>


        <ElementComponentsCustomButton class="block mx-auto mt-5" text="Seçilenleri Listeden Sil" @click="deleteTheWords()"/>

      </div>

      <div v-if="!shouldRenderTable" class="text-center text-3xl">
        Şu anda, aranıp bulunamayan sözcükler listesinde herhangi bir sözcük yok.
      </div>

  </div>

      </ClientOnly>
</template>

<style scoped>

.lostTable td, tr, th {
 @apply border border-black dark:border-white
}

</style>
