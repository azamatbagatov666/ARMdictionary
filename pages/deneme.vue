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


<button
  @touchstart="console.log('touchstart')"
  @touchend="console.log('touchend')"
  @pointerdown="console.log('pointerdown')"
  @pointerup="console.log('pointerup')"
  @click="console.log('click')"
  @contextmenu.prevent
  class="select-none bg-white [touch-action:manipulation] [-webkit-touch-callout:none]"
>
  Testhgfhgfhf
</button>

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
