import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "nuxt-phosphor-icons",
    /*[
      "nuxt-mail",
      {
        message: {
          to: process.env.NUXT_RECEIVER_EMAIL,
        },
        smtp: {
          host: "smtp.avedikyan.com",
          port: "587",
          secure: false,
          auth: {
            user: process.env.NUXT_SENDER_EMAIL,
            pass: process.env.NUXT_APP_PASSWORD,
          },
        },
      },
    ],*/
  ],
  i18n: {
    
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
   logLevel: 3,

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
