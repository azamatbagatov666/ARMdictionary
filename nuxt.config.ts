import { defineNuxtConfig } from 'nuxt/config'


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode', '@pinia/nuxt',
  ['nuxt-mail', {
    message: {
      to: 'saraerkan@hotmail.com',
    },
    smtp: {
      service: 'gmail',
      secure: true,
      auth: {
        user: 'saraerkan@gmail.com',
        pass: 'urhq rjhy isol dcus',
      },
    },
  }],
],colorMode: {
    classSuffix: ''
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ['~/assets/css/tailwind.css'],
  imports: {
    dirs: [
      'composables',
      'composables/*/index.{ts,js,mjs,mts}',
      'composables/**',
    ]
  },
})
