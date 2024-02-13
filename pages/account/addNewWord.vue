<script setup lang="ts">
import { type TDATA } from "~/models/TDATA";

useHead({
  title:'Yeni Sözcük Ekle',
})

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

const insertData = () => {
  if (confirm('Belirlediğiniz sonuç sözlüğe eklenecektir, emin misiniz?')) {

  if ((data.aranan && data.am && data.okunus && data.tr1 && data.tr4) !== "") {
    for(var key in data) {
    //@ts-ignore
    data[key] = data[key].trim();
}
  fetch("https://localhost:7109/InsertIt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            alert("Sonuç başarıyla eklendi.");
            resetData()
          }
        });
    
    
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
  <div class="mb-7">
    <div class="grid grid-cols-4 text-lg gap-y-2">
      <div class="flex items-center col-span-4">
        <label class="w-64">Aranan:<span style="color: red">*</span></label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="data.aranan" type="text" />
      </div>
      <div class="flex items-center">
        <label class="w-64">Aranan sözcüğün Ermenicesi:<span style="color: red">*</span></label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="data.am" type="text"/>
      </div>
      <div class="flex items-center col-span-3">
        <label class="w-52 ml-3">Kelimenin Okunuşu:<span style="color: red">*</span></label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="data.okunus" type="text"/>
      </div>
      <div class="flex items-center">
        <label class="w-64">Ermenice birinci anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="data.am1" type="text"/>
      </div>
      <div class="flex items-center">
        <label class="w-52 ml-3">Ermenice ikinci anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="data.alan2" type="text"/>
      </div>
      <div class="flex items-center col-span-2">
        <label class="w-52">Ermenice üçüncü anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="data.alan1" type="text"/>
      </div>
      <div class="flex items-center">
        <label class="w-64">Aranan sözcüğün Türkçesi:<span style="color: red">*</span></label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="data.tr1" type="text"/>
      </div>
      <div class="flex items-center">
        <label class="w-52 ml-3">Türkçe birinci anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="data.tr2" type="text"/>
      </div>
      <div class="flex items-center col-span-2">
        <label class="w-52">Türkçe ikinci anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="data.tr3" type="text"/>
      </div>
      <div class="flex items-center">
        <label class="w-64">Aranan sözcüğün İngilizcesi:<span style="color: red">*</span></label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="data.tr4" type="text"/>
      </div>
      <div class="flex items-center">
        <label class="w-52 ml-3">İngilizce birinci anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="data.tr5" type="text"/>
      </div>
      <div class="flex items-center">
        <label class="w-52">İngilizce ikinci anlam:</label>
        <ElementComponentsCustomInput class="w-52 border border-black" v-model="data.tr6" type="text"/>
      </div>
    </div>




    <div class="preview">
      <div style="font-size: 40px">Önizleme</div>

      <div class="searchbox">
        <div class="row">
          <ElementComponentsCustomInput class="motherElementComponentsCustomInput" id="motherElementComponentsCustomInput" placeholder="Bir kelime ara." autocomplete="off" readonly
            v-model="data.aranan" />

          <button class="motherbutton">
            <img src="/glass.png" width="35" height="35" alt="glass" />
          </button>
        </div>
      </div>

      <table class="border-2 border-black rounded-lg text-lg p-2 m-10 mx-auto block w-full sm:w-1/2 bg-gray-200 dark:bg-[#101010] dark:border-white">
    <tr class="mb-3 flex flex-wrap">
      <img class="w-9 h-9 mr-2" src="/flags/am-flag.png" />
      <td class="font-bold pr-3">
            <span class="text-red-500" v-text="data.am"></span>
            <span class = "ml-1 text" style="font-weight: normal" v-text="`(${data.okunus})`"></span>
          </td>
      <td class = "pr-3" v-text="data.am1"></td>
      <td class = "pr-3" v-text="data.alan2"></td>
      <td class = "pr-3" v-text="data.alan1"></td>
    </tr>
    <tr class="mb-3 flex flex-wrap">
      <img class="w-9 h-9 mr-2" src="/flags/tr-flag.png" />
      <td class = "pr-3 font-bold text-red-500" v-text="data.tr1"></td>
      <td class = "pr-3" v-text="data.tr2"></td>
      <td class = "pr-3" v-text="data.tr3"></td>
    </tr>
    <tr class="mb-3 flex flex-wrap">
      <img class="w-9 h-9 mr-2" src="/flags/eng-flag.png" />
      <td class = "pr-3 font-bold text-red-500" v-text="data.tr4"></td>
      <td class = "pr-3" v-text="data.tr5"></td>
      <td class = "pr-3" v-text="data.tr6"></td>
    </tr>
  </table>
  <ElementComponentsCustomButton text="Sözcüğü Sözlüğe Ekle" @click="insertData" class="block mx-auto"/>

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

.motherbutton {
  background: transparent;
  border: 0;
  outline: 0;
}

.searchbox {
  width: 600px;
  background-color: white;
  margin: 50px auto 0;
  border-radius: 5px;
}

.row {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  --tw-border-opacity: 1;
  border-color: rgb(0 0 0 / var(--tw-border-opacity));
  border-width: 1px;
}

</style>
