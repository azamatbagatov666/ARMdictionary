<script setup lang="ts">
const sideMenu = ref(true);

const { t } = useI18n();

const title = computed(() => t("title.faydalibilgiler"));
useHead({
  title,
});

const htmlContent = ref<string>();
const currentPage = ref<string>();
const connectionError = ref(false);
const { x, y } = useWindowScroll();
const { width, height } = useWindowSize();

const el = useTemplateRef("el");
const { height: elHeight } = useElementSize(el);

const pageChanged = async (content: ARTICLES) => {
  if (htmlContent.value != content.html) {
    htmlContent.value = content.html;
    currentPage.value = content.tag;
    x.value = 0;
    y.value = 0;

    if (width.value < 1024) {
      sideMenu.value = false;
    }
  }
};

watch(
  sideMenu,
  (open) => {
    if (width.value < 768) {
      document.body.style.overflow = open ? "hidden" : "";
    }
  },
  { immediate: true }
);

import type { ARTICLES } from "~/models/ARTICLES";
const articleData = ref<ARTICLES[] | null>(null);

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
  } catch (error) {
    connectionError.value = true;
  }
};

import { useWindowScroll, useWindowSize, useElementSize } from "@vueuse/core";
import { useTemplateRef } from "vue";

const scrollToTop = () => {
  scrollTo({ top: 0, left: 0, behavior: "smooth" });
};
</script>

<template>
  <div
    class="h-[90vh] flex items-center justify-center"
    v-if="!articleData && !connectionError"
  >
    <ElementComponentsLoadingAnimation />
  </div>

  <div
    v-else-if="connectionError"
    class="text-3xl flex items-center justify-center h-[90vh] text-white font-bold"
    v-text="t('adamAsmaca.noConnection')"
  ></div>

  <Transition name="slide-fade">
    <div v-show="sideMenu && articleData" class="sidenav">
      <span class="min-h-16"></span>
      <ul class="p-y-4 border-t-2 border-white overflow-y-auto">
        <li
          v-for="(item, index) in articleData"
          :key="item.id"
          v-text="item.title"
          class="transition-colors duration-200 p-2 whitespace-pre-wrap font-bold"
          :class="{ '!bg-red-500': currentPage == item.tag }"
          @click="pageChanged(item)"
        ></li>
      </ul>
    </div>
  </Transition>

  <div
    v-show="articleData"
    class="sideMenuButton transition-colors duration-300 fixed size-14 cursor-pointer mt-1 rounded-lg border-2 border-white bg-red-500 ml-8 z-50 active:!bg-[#136570] dark:active:!bg-[#282B30] active:duration-0"
    @click="sideMenu = !sideMenu"
  >
    <div
      class="grid h-full absolute bottom-[8px] left-4 place-content-center"
      :class="{ '!left-[23px]': !sideMenu }"
    >
      <div
        class="h-8 w-2 top-[27px] absolute bg-white transition-transform duration-300 rotate-45"
        :class="{ '!-rotate-45': sideMenu }"
      ></div>
      <div
        class="h-8 w-2 bg-white -rotate-45 transition-transform duration-300"
        :class="{ '!rotate-45': sideMenu }"
      ></div>
    </div>
  </div>

  <div
    ref="el"
    class="text-white mx-auto px-2 min-[880px]:px-4 pt-8 pb-16 transition-colors duration-300 rounded-lg my-4 w-full min-[880px]:w-5/6"
    v-if="htmlContent"
  >
    <div class="flex justify-center">
      <Transition name="fade" mode="out-in" appear>
        <div
          :key="currentPage"
          class="article min-[880px]:w-[80%] overflow-x-auto min-[880px]:overflow-x-visible min-[880px]:flex min-[880px]:justify-center"
          v-html="htmlContent"
        ></div>
      </Transition>
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
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-fade-leave {
  transform: translateX(0);
  opacity: 1;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

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

@media (hover: hover) and (pointer: fine) {
  .button:hover {
    cursor: pointer;
    background-color: black;
  }
  ul li:hover {
    @apply bg-gray-200;
  }

  .sideMenuButton:hover {
    @apply bg-orange-500;
  }
}
.button:active {
  background-color: #555;
}

.sidenav {
  height: 100%;
  @apply w-full min-[500px]:w-[500px] bg-gray-300 dark:bg-[#111] select-none text-lg;
  position: fixed;
  z-index: 20;
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
  @apply border-t border-b border-white py-2 cursor-pointer;
}

:deep(.article) table td,
table tr,
table th {
  @apply border border-white text-white;
}

:deep(.article) .boy tr {
  @apply odd:!bg-[#4D8C57] even:bg-[#262a2f] h-12;
}

:deep(.article) .girl tr {
  @apply odd:bg-[#8C4411] even:bg-[#262a2f] h-12;
}

:deep(.article) table td {
  @apply px-2;
}

:deep(.article) .easter td {
  @apply !px-1;
}

:deep(.article) img {
  @apply !pointer-events-auto;
}
</style>
