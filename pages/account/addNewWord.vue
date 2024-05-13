<script setup lang="ts">
import { type TDATA } from "~/models/TDATA";

import { useUserStore } from "~/store/user.store";
const userStore = useUserStore();
const isLogged = computed(() => userStore.state.user != undefined);

onBeforeMount(() => {
  setTimeout(() => {
    if (!isLogged.value) {
      navigateTo("/");
    }
  }, 500);
});

useHead({
  title: "Yeni Sözcük Ekle",
});

const data = reactive<TDATA>({
  aranan: "",
  am: "",
  alan2: "",
  alan1: "",
  alan3: "",
  am1: "",
  tr1: "",
  tr2: "",
  tr3: "",
  tr4: "",
  tr5: "",
  tr6: "",
  okunus: "",
});

const trimStrings = (obj: Record<string, any>) => {
  for (const key in obj) {
    if (typeof obj[key] === "string" && obj[key] != null) {
      obj[key] = obj[key].trim();
    }
  }
};

const insertData = async () => {
  if (confirm("Belirlediğiniz sonuç sözlüğe eklenecektir, emin misiniz?")) {
    if (
      (data.aranan && data.am && data.okunus && data.tr1 && data.tr4) !== ""
    ) {
      trimStrings(data);
      for (var key in data) {
        //@ts-ignore
        if (data[key] === "") {
          //@ts-ignore
          data[key] = null;
        }
      }

          try {
        const response = await $fetch<boolean>(
          `/api/account/update/insertIt`,
          {
            method: "POST",
            headers: {
              token: userStore.state.user!.token,
            },
            body: data,
          }
        );
        if (response) {
            alert("Sonuç başarıyla eklendi.");
            resetData();
        }
      } catch (error) {
          alert("Bağlantı Sorunu");

      }
/*
      insertIt(userStore.state.user!.token, data)
        .then((response) => {
          if (response.ok) {
            alert("Sonuç başarıyla eklendi.");
            resetData();
          }
        })
        .catch((error) => {
          alert("Bağlantı Sorunu");
        });*/
    } else {
      alert("* ile işaretli alanların doldurulması zorunludur.");
    }
  }
};

const resetData = () => {
  Object.keys(data).forEach((key) => {
    //@ts-ignore
    data[key] = "";
  });
};
</script>

<template>
  <div v-if="isLogged">
    <div class="flex items-center mb-8 mt-2">
      <ElementComponentsReturnButton
        @click="resetData()"
        class="ml-2 absolute"
      />
      <div
        v-text="'Yeni Sonuç Ekle'"
        class="bg-red-900 text-5xl text-center w-[500px] border-2 py-3 mx-auto inline-block border-black rounded-lg dark:border-white"
      ></div>
    </div>

    <div class="mt-4 ml-2 mb-7">
      <div>
        <label class="w-56 inline-block"
          >Aranan:<span class="text-[red] font-bold text-lg">*</span></label
        >
        <ElementComponentsCustomInput
          class="w-52 border border-black"
          v-model="data.aranan"
          type="text"
        />
      </div>

      <div class="flex mt-2">
        <div>
          <label class="w-56 inline-block"
            >Aranan sözcüğün Ermenicesi:<span class="text-[red] font-bold text-lg">*</span></label
          >
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.am"
            type="text"
          />
        </div>
        <div>
          <label class="w-40 ml-2 inline-block"
            >Sözcüğün Okunuşu:<span class="text-[red] font-bold text-lg">*</span></label
          >
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.okunus"
            type="text"
          />
        </div>
      </div>
      <div class="flex mt-2">
        <div>
          <label class="w-56 inline-block">Ermenice birinci anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.am1"
            type="text"
          />
        </div>
        <div>
          <label class="w-40 ml-2 inline-block">Ermenice ikinci anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.alan2"
            type="text"
          />
        </div>
        <div>
          <label class="w-44 ml-2 inline-block">Ermenice üçüncü anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.alan1"
            type="text"
          />
        </div>
      </div>
      <div class="flex mt-2">
        <div>
          <label class="w-56 inline-block"
            >Aranan sözcüğün Türkçesi:<span class="text-[red] font-bold text-lg">*</span></label
          >
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.tr1"
            type="text"
          />
        </div>
        <div>
          <label class="w-40 ml-2 inline-block">Türkçe birinci anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.tr2"
            type="text"
          />
        </div>
        <div>
          <label class="w-44 ml-2 inline-block">Türkçe ikinci anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.tr3"
            type="text"
          />
        </div>
      </div>
      <div class="flex mt-2">
        <div>
          <label class="w-56 inline-block"
            >Aranan sözcüğün İngilizcesi:<span class="text-[red] font-bold text-lg"
              >*</span
            ></label
          >
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.tr4"
            type="text"
          />
        </div>
        <div>
          <label class="w-40 ml-2 inline-block">İngilizce birinci anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.tr5"
            type="text"
          />
        </div>
        <div>
          <label class="w-44 ml-2 inline-block">İngilizce ikinci anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.tr6"
            type="text"
          />
        </div>
      </div>

      <div class="preview">
        <div class="text-[40px]">Önizleme</div>

        <div class="flex justify-center">
          <div class="flex justify-center">
            <div
              class="bg-gray-200 p-6 pb-1 border-2 border-black rounded-lg rounded-tr-none dark:bg-[#101010] dark:border-white transition-colors duration-300"
            >
              <ElementComponentsCustomButton
                disabled
                class="block mx-auto border-b-0 rounded-t-lg rounded-b-none w-52 outline-none active:!scale-100 active:!bg-white"
                :text="'Ermenice Klavye'"
              />
              <div class="sm:w-[300px] md:w-[450px] lg:w-[600px] flex">
                <input
                  type="text"
                  ref="search"
                  v-model="data.aranan"
                  class="motherinput selection:bg-transparent"
                  :placeholder="'Bir sözcük ara.'"
                  autocomplete="off"
                  maxlength="125"
                  readonly
                />

                <button disabled class="motherbutton border-l border-black">
                  <img src="/glass.png" width="30" height="30" />
                </button>
              </div>

              <div
                class="text-center text-sm my-1"
                v-text="
                  'Aramalarınızda birden fazla harf için  *  ve tek bir harf için  ?  kullanabilirsiniz.'
                "
              ></div>
            </div>
            <div class="w-0 flex flex-col gap-4 justify-start">
              <button
                disabled
                class="group bg-gray-200 rounded-r-md border-2 border-l-0 border-black h-12 w-12 place-items-center duration-300 dark:border-white dark:bg-[#101010]"
              >
                <div class="flex items-center ml-[5px]">
                  <div class="rounded-full size-9 bg-purple-600">
                    <img src="/random.png" class="size-9" />
                  </div>
                  <div class="w-0"></div>
                </div>
              </button>

              <button
                disabled
                class="group bg-gray-200 rounded-r-md border-2 border-l-0 border-black h-12 w-12 place-items-center duration-300 dark:border-white dark:bg-[#101010]"
              >
                <div class="flex items-center ml-[5px]">
                  <div
                    class="rounded-full flex items-center size-9 bg-blue-600"
                  >
                    <img src="/history.png" class="ml-[3px] size-7" />
                  </div>
                  <div class="w-0"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <table
          class="border-2 border-black rounded-lg text-lg p-2 m-10 mx-auto block w-full sm:w-1/2 bg-gray-200 dark:bg-[#101010] dark:border-white"
        >
          <tr class="mb-3 flex flex-wrap">
            <img class="w-9 h-9 mr-2" src="/flags/am-flag.png" />
            <td class="font-bold pr-3">
              <span class="text-red-500" v-text="data.am"></span>
              <span
                class="ml-1 font-normal"
                v-text="`(${data.okunus})`"
              ></span>
            </td>
            <td class="pr-3" v-text="data.am1"></td>
            <td class="pr-3" v-text="data.alan2"></td>
            <td class="pr-3" v-text="data.alan1"></td>
          </tr>
          <tr class="mb-3 flex flex-wrap">
            <img class="w-9 h-9 mr-2" src="/flags/tr-flag.png" />
            <td class="pr-3 font-bold text-red-500" v-text="data.tr1"></td>
            <td class="pr-3" v-text="data.tr2"></td>
            <td class="pr-3" v-text="data.tr3"></td>
          </tr>
          <tr class="mb-3 flex flex-wrap">
            <img class="w-9 h-9 mr-2" src="/flags/eng-flag.png" />
            <td class="pr-3 font-bold text-red-500" v-text="data.tr4"></td>
            <td class="pr-3" v-text="data.tr5"></td>
            <td class="pr-3" v-text="data.tr6"></td>
          </tr>
        </table>
        <ElementComponentsCustomButton
          text="Sözcüğü Sözlüğe Ekle"
          @click="insertData"
          class="block mx-auto"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview {
  text-align: center;
  margin-top: 30px;
}

.motherElementComponentsCustomInput {
  flex: 1;
  height: 50px;
  background: transparent;
  border: 0;
  outline: 0;
  font-size: 18px;
  color: #333;
}

.motherinput {
  cursor: default;
  flex: 1;
  height: 53px;
  background: transparent;
  outline: 0;
  font-size: 18px;
  color: #333;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-right: 7px;
  border-left-width: 1px;
  border-bottom-width: 1px;
  border-top-width: 1px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-color: black;
  background-color: white;
}

.motherbutton {
  width: 60px;
  height: 53px;
  background-color: limegreen;
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
  padding-left: 10px;
  margin-right: -2px;
  border-width: 1px;
  border-color: black;
  transition: background-color 0.3s;
}
</style>
