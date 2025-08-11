import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "nuxt-phosphor-icons",
    [
      "nuxt-mail",
      {
        message: {
          to: "saraerkan@hotmail.com",
        },
        smtp: {
          host: "smtp.avedikyan.com",
          port: "587",
          secure: false,
          auth: {
            user: "info@avedikyan.com",
            pass: "Sasunik0426",
          },
        },
      },
    ],
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
