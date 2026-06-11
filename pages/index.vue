<script setup lang="ts">
import type { TDATA } from "~/models/TDATA";
import { useSearchHistoryStore } from "~/store/search-history.store";
import { useElementVisibility } from "@vueuse/core";
import { useTemplateRef } from "vue";
const target = useTemplateRef("target");
const targetIsVisible = useElementVisibility(target);

const loading = ref(true);

const route = useRoute();
const router = useRouter();

const desword = ref(""); // input
const previousDesword = ref(""); // dedupe only
const activeWord = ref(""); // displayed result context

if (typeof route.query.q === "string" && route.query.q.trim() !== "") {
  desword.value = route.query.q;
  activeWord.value = route.query.q;
}

onMounted(async () => {
  if (desword.value.trim() !== "") {
    await submit();
    await nextTick();
    searchline.value?.wordFromAbove?.(desword.value);
  }

  loading.value = false;
});

const { t } = useI18n();

const thereIsNoResult = ref(false);
const thereIsNoConnection = ref(false);
const searchline = ref();
const alpTable = ref();
const searchHistoryStore = useSearchHistoryStore();

const { $bus } = useNuxtApp();

$bus.on("clear-main-page", () => {
  thereIsNoResult.value = false;
  thereIsNoConnection.value = false;
  responseData.value = [];
  previousDesword.value = "";
  activeWord.value = "";
  desword.value = "";
  shareOn.value = false;
  if (alpTable.value) {
    alpTable.value.closePanel();
  }
});

const shareOn = ref(true);

const setToday = async (todayData: TDATA[]) => {
  responseData.value = todayData;
  desword.value = todayData[0].ARANAN!;
  previousDesword.value = desword.value;
  activeWord.value = desword.value;
  shareOn.value = false;
  searchHistoryStore.addHistory(desword.value);
  thereIsNoResult.value = false;
  thereIsNoConnection.value = false;
  router.replace({ query: { q: desword.value } });

  searchline.value.wordFromAbove(desword.value);

  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!targetIsVisible.value) {
          scrollToTarget();
        }
      });
    });
  });
};

const seoTitle = computed(() => {
  if (!activeWord.value) {
    return t("title.index");
  }
  return `${activeWord.value} – ${t("title.index")}`;
});

const seoDescription = computed(() => {
  if (!activeWord.value) {
    return t("meta.index");
  }
  return `${activeWord.value} ${t("meta.indexShort")}`;
});

const seoUrl = computed(() => {
  if (!activeWord.value) {
    return "https://www.avedikyan.com";
  }
  return `https://www.avedikyan.com/?q=${encodeURIComponent(activeWord.value)}`;
});

useHead({
  title: seoTitle,

  meta: [
    {
      name: "description",
      content: seoDescription,
    },

    // Open Graph
    {
      property: "og:title",
      content: seoTitle,
    },
    {
      property: "og:description",
      content: seoDescription,
    },
    {
      property: "og:url",
      content: seoUrl,
    },
    {
      property: "og:type",
      content: "website",
    },

    // Twitter (optional but recommended)
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:title",
      content: seoTitle,
    },
    {
      name: "twitter:description",
      content: seoDescription,
    },
  ],

  link: [
    {
      rel: "canonical",
      href: seoUrl,
    },
  ],
});

const wordInput = (data: string) => {
  desword.value = data;
};

const responseData = ref<TDATA[]>([]);
const submit = async () => {
  if (desword.value == "" || desword.value == previousDesword.value) {
    return;
  }

  try {
    const data = await $fetch<TDATA[]>(
      `/api/search/${encodeURIComponent(desword.value)}`,
    );

    responseData.value = [];
    previousDesword.value = desword.value;
    activeWord.value = desword.value;

    router.replace({ query: { q: desword.value } });

    if (
      Array.isArray(data) &&
      data.length > 0 &&
      data[0].ARANAN !== "NotFound"
    ) {
      responseData.value = data;
      thereIsNoResult.value = false;
      thereIsNoConnection.value = false;
      searchHistoryStore.addHistory(desword.value);
      shareOn.value = false;
      nextTick(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!targetIsVisible.value) {
              scrollToTarget();
            }
          });
        });
      });
    } else {
      thereIsNoResult.value = true;
      thereIsNoConnection.value = false;
    }
  } catch (e) {
    thereIsNoConnection.value = true;
    thereIsNoResult.value = false;

    return;
  }
};

const random = async () => {
  const { data, error } = await useFetch(`/api/get/getARandomWord`, {
    method: "GET",
  });

  if (error.value) {
    thereIsNoConnection.value = true;
    thereIsNoResult.value = false;

    return;
  }
  responseData.value = [];
  if (data.value && data.value.length > 0) {
    responseData.value = data.value;
    desword.value = responseData.value[0].ARANAN ?? "";
    thereIsNoResult.value = false;
    thereIsNoConnection.value = false;
    previousDesword.value = desword.value;
    shareOn.value = false;
    activeWord.value = desword.value;

    router.replace({ query: { q: desword.value } });

    searchline.value.wordFromAbove(desword.value);
    searchHistoryStore.addHistory(desword.value);
    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!targetIsVisible.value) {
            scrollToTarget();
          }
        });
      });
    });
  } else {
    thereIsNoResult.value = true;
    thereIsNoConnection.value = false;
  }
};

const buttonClick = (event: Event) => {
  event.preventDefault();
};

const scrollToTarget = () => {
  if (target.value) {
    target.value.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const getShareInfo = () => {
  return `${t("title.indexShort")}\n` +
    `${seoDescription.value}\n` +
    `${seoUrl.value}`;
    
};

const copyLink = async () => {


  await navigator.clipboard.writeText(getShareInfo());
};

const shareWhatsApp = () => {

  const url = `https://wa.me/?text=${encodeURIComponent(getShareInfo())}`;

  window.open(url, "_blank");
};

const shareFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    seoUrl.value
  )}`;

  window.open(url, "_blank");
};

const shareTwitter = () => {


  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    getShareInfo()
  )}`;

  window.open(url, "_blank");
};

</script>

<template>
  <div>
    <div class="h-[78dvh] flex items-center justify-center" v-if="loading">
      <ElementComponentsLoadingAnimation />
    </div>

    <div v-show="!loading" class="containers">
      <ElementComponentsLogoBanner />

      <div class="flex justify-center w-full">
        <div class="w-full">
          <SearchLine
            @input-changed="wordInput"
            @submit-request="submit"
            @random-request="random"
            @set-today="setToday"
            ref="searchline"
          ></SearchLine>
        </div>
      </div>

      <div class="flex justify-center my-2">
        <NuxtLink
          to="/wordle"
          class="select-none frame active:bg-gray-400 wordle font-bold py-2 px-4"
        >
          WORDLE
        </NuxtLink>
      </div>

      <AlpTable ref="alpTable" />

      <div ref="target">
        <wordTable :responseData="responseData"></wordTable>

        <div>
          <div class="flex justify-center">
            <ColorSvgButtons
              :aria-label="'Sonucu Paylaş'"
              :colour="'green'"
              :buttonText="t('index.share')"
              v-if="responseData.length > 0"
              @button-clicked="shareOn = !shareOn"
            >
              <svg viewBox="0 0 24 24" class="size-7 fill-white mr-1">
                <path
                  d="M15 6.75C15 5.50736 16.0074 4.5 17.25 4.5C18.4926 4.5 19.5 5.50736 19.5 6.75C19.5 7.99264 18.4926 9 17.25 9C16.0074 9 15 7.99264 15 6.75ZM17.25 3C15.1789 3 13.5 4.67893 13.5 6.75C13.5 7.00234 13.5249 7.24885 13.5724 7.48722L9.77578 9.78436C9.09337 8.85401 7.99222 8.25 6.75 8.25C4.67893 8.25 3 9.92893 3 12C3 14.0711 4.67893 15.75 6.75 15.75C8.10023 15.75 9.28379 15.0364 9.9441 13.9657L13.5866 16.4451C13.5299 16.7044 13.5 16.9737 13.5 17.25C13.5 19.3211 15.1789 21 17.25 21C19.3211 21 21 19.3211 21 17.25C21 15.1789 19.3211 13.5 17.25 13.5C15.9988 13.5 14.8907 14.1128 14.2095 15.0546L10.4661 12.5065C10.4884 12.3409 10.5 12.1718 10.5 12C10.5 11.7101 10.4671 11.4279 10.4049 11.1569L14.1647 8.88209C14.8415 9.85967 15.971 10.5 17.25 10.5C19.3211 10.5 21 8.82107 21 6.75C21 4.67893 19.3211 3 17.25 3ZM15 17.25C15 16.0074 16.0074 15 17.25 15C18.4926 15 19.5 16.0074 19.5 17.25C19.5 18.4926 18.4926 19.5 17.25 19.5C16.0074 19.5 15 18.4926 15 17.25ZM4.5 12C4.5 10.7574 5.50736 9.75 6.75 9.75C7.99264 9.75 9 10.7574 9 12C9 13.2426 7.99264 14.25 6.75 14.25C5.50736 14.25 4.5 13.2426 4.5 12Z"
                ></path>
              </svg>
            </ColorSvgButtons>
          </div>
          <div class="flex justify-center gap-4 mt-4 min-h-8">
            <div v-if="shareOn && responseData.length > 0" class="flex gap-4">
              <button class="shareButtons !bg-[#1BD741]" @click="shareWhatsApp">
                <svg class="size-5 fill-white" viewBox="0 0 24 24">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.50002 12C3.50002 7.30558 7.3056 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C10.3278 20.5 8.77127 20.0182 7.45798 19.1861C7.21357 19.0313 6.91408 18.9899 6.63684 19.0726L3.75769 19.9319L4.84173 17.3953C4.96986 17.0955 4.94379 16.7521 4.77187 16.4751C3.9657 15.176 3.50002 13.6439 3.50002 12ZM12 1.5C6.20103 1.5 1.50002 6.20101 1.50002 12C1.50002 13.8381 1.97316 15.5683 2.80465 17.0727L1.08047 21.107C0.928048 21.4637 0.99561 21.8763 1.25382 22.1657C1.51203 22.4552 1.91432 22.5692 2.28599 22.4582L6.78541 21.1155C8.32245 21.9965 10.1037 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5ZM14.2925 14.1824L12.9783 15.1081C12.3628 14.7575 11.6823 14.2681 10.9997 13.5855C10.2901 12.8759 9.76402 12.1433 9.37612 11.4713L10.2113 10.7624C10.5697 10.4582 10.6678 9.94533 10.447 9.53028L9.38284 7.53028C9.23954 7.26097 8.98116 7.0718 8.68115 7.01654C8.38113 6.96129 8.07231 7.046 7.84247 7.24659L7.52696 7.52195C6.76823 8.18414 6.3195 9.2723 6.69141 10.3741C7.07698 11.5163 7.89983 13.314 9.58552 14.9997C11.3991 16.8133 13.2413 17.5275 14.3186 17.8049C15.1866 18.0283 16.008 17.7288 16.5868 17.2572L17.1783 16.7752C17.4313 16.5691 17.5678 16.2524 17.544 15.9269C17.5201 15.6014 17.3389 15.308 17.0585 15.1409L15.3802 14.1409C15.0412 13.939 14.6152 13.9552 14.2925 14.1824Z"
                  ></path>
                </svg>
              </button>

              <button class="shareButtons !bg-gray-500" @click="copyLink">
                <svg
                  fill="#000000"
                  viewBox="0 0 425.466 425.467"
                  class="size-5 fill-white"
                >
                  <path
                    d="M318.15,230.195l77.934-77.937c31.894-31.892,31.894-83.782-0.004-115.674l-12.66-12.66 c-31.893-31.896-83.78-31.896-115.674-0.004l-77.937,77.934c-17.588,17.588-25.457,41.264-23.646,64.311 c-23.045-1.813-46.722,6.056-64.308,23.647L23.92,267.748c-31.894,31.889-31.894,83.779,0,115.674l12.664,12.662 c31.893,31.893,83.783,31.893,115.674,0l77.935-77.936c17.592-17.59,25.459-41.266,23.647-64.309 C276.884,255.654,300.56,247.783,318.15,230.195z M202.653,290.605l-77.936,77.938c-16.705,16.703-43.889,16.703-60.59,0 l-12.666-12.666c-16.705-16.701-16.703-43.885,0-60.594l77.936-77.932c14.14-14.141,35.779-16.306,52.226-6.516l-32.302,32.307 c-7.606,7.604-7.606,19.938,0,27.541c7.605,7.607,19.937,7.607,27.541,0l32.306-32.303 C218.959,254.828,216.795,276.469,202.653,290.605z M238.382,209.169l32.299-32.306c7.608-7.602,7.608-19.935,0-27.538 c-7.604-7.61-19.936-7.61-27.541-0.004l-32.303,32.303c-9.791-16.446-7.627-38.087,6.514-52.226l77.935-77.935 c16.707-16.707,43.89-16.707,60.594,0l12.664,12.664c16.705,16.705,16.705,43.886,0,60.591l-77.936,77.937 C276.468,216.797,254.828,218.959,238.382,209.169z"
                  ></path>
                </svg>
              </button>

              <button class="shareButtons !bg-[#1A77F2]" @click="shareFacebook">
                <svg
                  aria-label="Facebook logo"
                  class="size-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="white"
                    d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"
                  ></path>
                </svg>
              </button>

              <button class="shareButtons !bg-black" @click="shareTwitter">
                <svg
                  aria-label="X logo"
                  class="size-5"
                  viewBox="0 0 300 271"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="thereIsNoResult"
        class="text-lg text-center mt-4 text-white font-bold"
        v-text="t('index.noResult')"
      ></div>
      <div
        v-if="thereIsNoConnection"
        class="text-lg text-center mt-4 text-white font-bold"
        v-text="t('index.noConnection')"
      ></div>
    </div>
  </div>
</template>

<style scoped>
@media (hover: hover) and (pointer: fine) {
  .wordle:hover {
    @apply bg-gray-400;
  }
}

.shareButtons {
  @apply btn btn-sm px-0 !w-10 border-black dark:border-white;
}
</style>
