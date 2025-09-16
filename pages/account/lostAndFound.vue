<script lang="ts" setup>
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

onMounted(() => {
  if (isLogged.value) {
    refresh();
  }
})

const deleteTheWords = async () => {
  if (
    confirm(
      "Seçtiğiniz sözcükler aranıp bulunamayan sözcükler listesinden silinecektir, emin misiniz?"
    )
  ) {
    if (idData.arananlar.length > 0) {
      try {

        const response = await $fetch<boolean>(`/api/account/update/deletingFromLostAndFound`, {
    method: 'POST',
    headers: {
        token: userStore.state.user!.token
    },
    body: ({
        arananlar: idData.arananlar,
        desiredID: idData.DesiredID
    })
});
        if (response) {
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


    const data = await $fetch(`/api/get/gettingSearchedOnes`, {
    method: 'GET',
    headers: {
      token: userStore.state.user!.token
    }
  });

    if (data) {
    dataFetched.value = true;
  }

    if (data && Array.isArray(data) && data.length > 0) {
      responseData.value = data;
    }
  } catch (error) {
    connectionError.value = true

  }
};

watch(
  () => isLogged.value,
  () => {
    refresh();
  },
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


import { useWindowScroll, useWindowSize, useElementSize } from "@vueuse/core";
import { useTemplateRef } from "vue";

const { x, y } = useWindowScroll();
const { width, height } = useWindowSize();

const el = useTemplateRef("el");
const { height: elHeight } = useElementSize(el);

const scrollToTop = () => {
  scrollTo({ top: 0, left: 0, behavior: "smooth" });
};
</script>

<template>
  <div v-if="isLogged">
    <div class="mt-2 mb-12">

      <div class="h-[85vh] flex items-center justify-center"  v-if="!connectionError && !dataFetched">
<ElementComponentsLoadingAnimation/>
  </div>

      <div v-if="responseData.length > 0" ref="el">
        <table class="lostTable mx-auto table-auto text-black dark:text-white">
          <tbody>
          <tr
          class="bg-gray-300 dark:bg-[#262a2f] "
          
          >
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
            class="even:dark:bg-[rgb(128,128,128)] even:bg-[#f2f2f2] odd:bg-gray-300 odd:dark:bg-[#262a2f]"
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
            <td class="border text-center" v-text="index + 1"></td>
            <td class="border px-2 w-[400px]" v-text="item.aranan"></td>
            <td class="border w-44 text-center" v-text="item.date"></td>
          </tr>
          </tbody>
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

      <Transition name="fade" mode="out-in">
    <div
      class="button border-2 border-white"
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
  bottom: 30px;
  right: 30px;
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


</style>
