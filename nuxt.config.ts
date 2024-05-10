import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
          service: "gmail",
          secure: true,
          auth: {
            user: process.env.NUXT_SENDER_EMAIL,
            pass: process.env.NUXT_APP_PASSWORD,
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
});