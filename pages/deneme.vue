<script setup lang="ts">
const sideMenu = ref(true);



const htmlContent = ref<string | null>(null);
const currentPage = ref<string | null>(null);

const pageChanged = async (content: ARTICLES) => {
  htmlContent.value = content.html as string;
  currentPage.value = content.tag as string;
  x.value = 0;
  y.value = 0;
  
};

import type { ARTICLES } from "~/models/ARTICLES";
const articleData = ref<ARTICLES[]>([]);


onBeforeMount(async () => {
    getArticles();
});

const getArticles = async () => {
  try {
    const data = await $fetch(`/api/get/getTheArticles`, {
      method: "GET",
    });
    if (data && Array.isArray(data)) {
      articleData.value = data;
    } else {
    }
  } catch (error) {}
};


import { useWindowScroll, useWindowSize, useElementSize } from '@vueuse/core'
import { useTemplateRef } from 'vue'


const { x, y } = useWindowScroll()
const { height } = useWindowSize()

const el = useTemplateRef('el')
const { height: elHeight } = useElementSize(el);


const scrollToTop =  () => {
 scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  
};




</script>

<template>
  
<div v-show="sideMenu" class="sidenav">
    <span class="min-h-16" @click="sideMenu = false;"></span>
    <ul class="p-y-4 border-t-2 border-white  overflow-y-auto">
      <li  v-for="(item, index) in articleData":key="item.id" v-text="item.title" class="hover:bg-gray-200 p-2" :class="{'!bg-red-500' : currentPage==item.tag}" @click="pageChanged(item)"></li>
          
      </ul>
</div>

<div class="fixed size-14 mt-1 rounded-lg border-2 border-white bg-red-500  ml-8 z-50" @click="sideMenu = !sideMenu;">

    <div class="grid h-full absolute bottom-[8px] left-4 place-content-center" :class="{'!left-[23px]' : !sideMenu}">
    <div class="h-8 w-2 top-[27px] absolute bg-white transition-transform duration-300 rotate-45" :class="{'!-rotate-45' : sideMenu}"></div>
    <div class="h-8 w-2 bg-white -rotate-45 transition-transform duration-300" :class="{'!rotate-45' : sideMenu}"></div>
  </div>
</div>

    <div ref="el" class="text-white mx-auto px-px min-[500px]:px-4 pt-8 pb-16 transition-colors duration-300  rounded-lg my-4 w-full sm:w-5/6" v-if="htmlContent">

      <div class="flex justify-center">
<div class="article min-[500px]:w-[80%] overflow-x-auto  min-[500px]:overflow-x-visible min-[500px]:flex min-[500px]:justify-center" v-html="htmlContent"></div>
</div>


    </div>
      <Transition name="fade">

<div class="button border-2 border-white" @click="scrollToTop" v-if="y > 300 && elHeight > height">
  <div class="grid h-full place-content-center">
    <div class="flex gap-1">
    <div class="h-6 w-2 bg-white rotate-45"></div>
    <div class="h-6 w-2 bg-white -rotate-45"></div>
  </div>
  </div>
</div>
      </Transition>

</template>

<style scoped>



.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.button {
  display: inline-block;
  background-color: #FF6F61;
  width: 50px;
  height: 50px;
  text-align: center;
  border-radius: 20px;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.button:hover {
  cursor: pointer;
  background-color: black;
}
.button:active {
  background-color: #555;
}

.sidenav {
  height: 100%;
  @apply w-full min-[500px]:w-[500px] bg-gray-300 dark:bg-[#111];
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  overflow: hidden;
  transition: 0.5s;
  display: flex;
  flex-direction: column; 
  padding-top: 48px; 

}

.closebtn {
  color: white;
  font-size: 36px;
}

ul li {

  @apply border-t border-b border-white py-2;
}






:deep(.article) 
  table td,
  table tr,
  table th {
    @apply border border-white text-white;
  }

  :deep(.article) 
  .boy tr {
    @apply odd:!bg-[#4D8C57] even:bg-[#262a2f] h-12;
  }

:deep(.article) 
  .girl tr {
    @apply odd:bg-[#8C4411] even:bg-[#262a2f] h-12;
  }

  :deep(.article) 
  table td {
    @apply px-2;
  }

  :deep(.article) 
  .easter td {
    @apply !px-1;
  }






</style>
