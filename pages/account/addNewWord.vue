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
    <div class="grid gap-2 sm:flex items-center mb-8 mt-2">
      <ElementComponentsReturnButton
        @click="resetData()"
        class="ml-2 sm:absolute"
      />
      <div
        v-text="'Yeni Sözcük Ekle'"
        class="bg-red-900 text-5xl text-center sm:w-[500px] border-2 p-3 mx-auto inline-block border-black rounded-lg text-white dark:border-white"
      ></div>
    </div>

    <div class="mt-4 ml-2 mb-7">
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
            v-model="data.AM"
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
            v-model="data.OKUNUS"
            type="text"
          />
        </div>
      </div>
 <div class="flex mt-2">
        <div>
          <label class="w-56 inline-block">Ermenice birinci anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.AM1"
            type="text"
          />
        </div>
        <div>
          <label class="w-40 ml-2 inline-block">Ermenice ikinci anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.ALAN2"
            type="text"
          />
        </div>
        <div>
          <label class="w-44 ml-2 inline-block">Ermenice üçüncü anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.ALAN1"
            type="text"
          />
        </div>
      </div>
      <div class="flex mt-2">
        <div>
          <label class="w-56 inline-block"
            >Aranan sözcüğün Türkçesi:<span class="text-[red] font-bold text-lg"
              >*</span
            ></label
          >
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.TR1"
            type="text"
          />
        </div>
        <div>
          <label class="w-40 ml-2 inline-block">Türkçe birinci anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.TR2"
            type="text"
          />
        </div>
        <div>
          <label class="w-44 ml-2 inline-block">Türkçe ikinci anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.TR3"
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
            v-model="data.TR4"
            type="text"
          />
        </div>
        <div>
          <label class="w-40 ml-2 inline-block">İngilizce birinci anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.TR5"
            type="text"
          />
        </div>
        <div>
          <label class="w-44 ml-2 inline-block">İngilizce ikinci anlam:</label>
          <ElementComponentsCustomInput
            class="w-52 border border-black"
            v-model="data.TR6"
            type="text"
          />
        </div>
      </div>

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
</style>
