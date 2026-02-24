<script setup lang="ts">
import { useSearchHistoryStore } from './store/search-history.store';
import { useUserStore } from './store/user.store';
const languageState = useLanguageState();
const searchHistoryStore = useSearchHistoryStore()
const userStore = useUserStore();

const { setLocale } = useI18n();

const htmlLang = computed(() => {
  switch (languageState.value) {
    case 'am':
      return 'hyw' 
    case 'tr':
      return 'tr'
    case 'en':
      return 'en'
    default:
      return 'tr'
  }
})


useHead({
  link: [
    { rel: "manifest", href: "/manifest.json" },
    { rel: "icon", href: "/icon-192.png" },
    { rel: "apple-touch-icon", href: "/icon-192.png" }
  ],
  meta: [
    { name: "theme-color", content: "#ffffff" },

    // Standard (Chrome, Android, etc.)
    { name: "mobile-web-app-capable", content: "yes" },

    // iOS Safari (still required)
    { name: "apple-mobile-web-app-capable", content: "yes" },

        { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Avedikyan Sözlük' },
    {
      property: 'og:description',
      content: 'Batı Ermenicesi sözlük, oyunlar ve faydalı bilgiler.'
    },
    {
      property: 'og:image',
      content: 'https://avedikyan.com/og-image.jpg'
    },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: 'https://avedikyan.com' },
  ],
    htmlAttrs: {
    lang: htmlLang
  }
});



onMounted(async () => {
  const language = localStorage.getItem("language");
  if (language) setLocale(language);
  searchHistoryStore.readInitial();
  userStore.reLoginFromLocalStorage();
});
</script>

<template>
  <div>

    <header>

<div>
<NavBarNavMenu class="hidden lg:flex"/>

<NavBarMobileNavMenu/>
</div>
    </header>


    <main id="main-content">

  <NuxtPage></NuxtPage>
      </main>
</div>
</template>
