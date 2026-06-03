<script setup lang="ts">
import { type TDATA } from "~/models/TDATA";

useHead({
  title: "AVEDİKYAN - Yeni Sözcük Ekle",
});

const data = reactive<TDATA>({
  ARANAN: "",
  AM: "",
  ALAN2: "",
  ALAN1: "",
  ALAN3: "",
  AM1: "",
  TR1: "",
  TR2: "",
  TR3: "",
  TR4: "",
  TR5: "",
  TR6: "",
  OKUNUS: "",
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
    if ((data.AM && data.OKUNUS && data.TR1 && data.TR4) !== "") {
      trimStrings(data);
      for (var key in data) {
        //@ts-ignore
        if (data[key] === "") {
          //@ts-ignore
          data[key] = null;
        }
      }

      try {
        const response = await fetchWithAuth<boolean>(`/api/account/update/insertIt`, {
          method: "POST",

          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });
        if (response) {
          alert("Sonuç başarıyla eklendi.");
          resetData();
        }
      } catch (error) {
        alert("Bağlantı Sorunu");
      }
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
  <div>

      <ElementComponentsTitle :showReset="true" @reset-clicked="resetData" text="Yeni Sözcük Ekle"></ElementComponentsTitle>


      <div class="px-2 sm:px-8 text-white place-center">


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
                v-model="data.AM"
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
                v-model="data.OKUNUS"
                type="text"
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1 min-w-0">
              <label>Ermenice birinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="data.AM1"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label>Ermenice ikinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="data.ALAN2"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label>Ermenice üçüncü anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="data.ALAN1"
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
                v-model="data.TR1"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label>Türkçe birinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="data.TR2"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label>Türkçe ikinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="data.TR3"
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
                v-model="data.TR4"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label>İngilizce birinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="data.TR5"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label>İngilizce ikinci anlam:</label>
              <ElementComponentsCustomInput
                class="w-full border border-black"
                v-model="data.TR6"
              />
            </div>
          </div>
        </div>
        </div>

    

    <div class="mt-4 mb-7">



      <div class="preview">
        <div class="text-[40px] text-center text-white">Önizleme</div>

        <WordTable :responseData="[data]"></WordTable>


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
label {
  @apply text-white;
}
.preview {
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

.theForm label {
  @apply text-sm md:text-base w-full block;
}
</style>
