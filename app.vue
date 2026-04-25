<script setup lang="ts">
import { useSearchHistoryStore } from './store/search-history.store';
const languageState = useLanguageState();
const searchHistoryStore = useSearchHistoryStore()

const { setLocale } = useI18n();

const session = useState<boolean>("session", () => false)



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
  session.value = Boolean(useCookie("session").value)
  const language = localStorage.getItem("language");
  if (language) setLocale(language);
  searchHistoryStore.readInitial();
});
</script>

<template>
  <div class="min-h-[100dvh]  flex flex-col">
    <header>
      <NavBarNavMenu class="hidden lg:flex" />
      <NavBarMobileNavMenu />
    </header>

    <main class="flex-1" id="main-content">
      <NuxtPage />
    </main>

    <footer>
      <Footer />
    </footer>
  </div>
</template>
