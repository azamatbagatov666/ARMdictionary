module.exports = {
    plugins: [
    require('daisyui'),
  ],
    daisyui: {
    themes: false,
    base: false,
  },
  darkMode: 'class',
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./app.vue",
      "./error.vue",
    ],
    theme: {
      extend: {},
    },
  }