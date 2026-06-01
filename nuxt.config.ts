import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   app: {
    head: {
      meta: [
        {
          name: "google-site-verification",
          content: "suk1WLVuI7PtnGbEGw_92AkIFClMC-AMAavKiBuhmgU",
        },
      ],
    },
  },
  modules: [
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    [
      "nuxt-mail",
      {
        message: {
          to: process.env.NUXT_RECEIVER_EMAIL,
        },
        smtp: {
          host: "smtp-mail.outlook.com",
          port: "587",
          auth: {
            user: process.env.NUXT_SENDER_EMAIL,
            pass: process.env.NUXT_APP_PASSWORD,
          },
        },
      },
    ],
  ],
i18n: {
  locales: [
    { code: "tr", iso: "tr-TR" },
    { code: "en", iso: "en-US" },
    { code: "am", iso: "hy-AM" }
  ],
  defaultLocale: "tr",
  strategy: "no_prefix"
},
  colorMode: {
    classSuffix: "",
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["~/assets/css/tailwind.css"],
  imports: {
    dirs: [
      "composables",
      "composables/*/index.{ts,js,mjs,mts}",
      "composables/**",
    ],
  },
   nitro: {
   preset: 'node-server',
   compatibilityDate: '2025-07-11',
  },
  vite: {
    server: {
        hmr: {
            clientPort: 3000
        }
    }
},
  devtools: {
    enabled: false
  },
});
