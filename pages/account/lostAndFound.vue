<script lang="ts" setup>
import { gettingSearchedOnes } from "~/services/gettingSearchedOnes";
import { deletingFromLostAndFound } from "~/services/deletingFromLostAndFound";
import { type LOSTANDFOUND } from "~/models/LOSTANDFOUND";
const responseData = ref<LOSTANDFOUND[]>([]);
const selectedListWord = ref<string[]>([]);
const connectionError = ref(false);
const dataFetched = ref(false);


import { useUserStore } from "~/store/user.store";
const userStore = useUserStore();
const isLogged = computed(() => userStore.state.user != undefined);

const idData = reactive({
  arananlar: selectedListWord,
  DesiredID: 0,
});

onBeforeMount(() => {
  setTimeout(() => {
    if (!isLogged.value) {
      navigateTo("/");
    }
  }, 500);
});

const deleteTheWords = async () => {
  if (
    confirm(
      "Seçtiğiniz sözcükler aranıp bulunamayan sözcükler listesinden silinecektir, emin misiniz?"
    )
  ) {
    if (idData.arananlar.length > 0) {
      try {
        const response = await deletingFromLostAndFound(userStore.state.user!.token, idData);

        if (response.ok) {
          selectAll.value = false;
          selectedListWord.value = [];
          responseData.value = [];
          refresh();
        }
      } catch (error) {}
    } else {
      window.alert(
        "Herhangi bir seçim yapmadınız. Önce silinmesini istediğiniz sözükleri işaretleyin."
      );
    }
  }
};

const refresh = async () => {
  if (!isLogged) return;
  try {

    const data = await gettingSearchedOnes(userStore.state.user!.token);
    if (data) {
    dataFetched.value = true;
  }

    if (data && Array.isArray(data) && data.length > 0) {
      responseData.value = data;
      console.log("no error")
    }
  } catch (error) {
    connectionError.value = true
    console.log("error", error)

  }
};

watch(
  () => isLogged.value,
  () => {
    refresh();
  },
  {
    immediate: true,
  }
);

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
  <ClientOnly v-if="isLogged">
    <div class="mt-2 mb-12">

      <div class="h-[85vh] flex items-center justify-center"  v-if="!connectionError && !dataFetched">
<ElementComponentsLoadingAnimation/>
  </div>

      <div v-if="responseData.length > 0">
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
          <tr
            class="even:dark:bg-[rgb(128,128,128)] even:bg-[#f2f2f2]"
            :class="{
              'dark:!bg-[rgb(128,0,128)] !bg-[rgb(255,165,100)]':
                selectedListWord.includes(item.aranan ?? ''),
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

        <ElementComponentsCustomButton
          class="block mx-auto mt-5"
          text="Seçilenleri Listeden Sil"
          @click="deleteTheWords()"
        />
      </div>

      <div v-else-if="connectionError" class="text-3xl flex items-center justify-center h-[85vh]">
        Bağlantı Sorunu
      </div>

      <div v-else-if="responseData.length == 0 && dataFetched" class="text-3xl flex items-center justify-center h-[85vh]">
        Şu anda, aranıp bulunamayan sözcükler listesinde herhangi bir sözcük
        yok.
      </div>


    </div>
  </ClientOnly>
</template>

<style scoped>
.lostTable td,
tr,
th {
  @apply border border-black dark:border-white;
}
</style>
