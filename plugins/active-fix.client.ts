export default defineNuxtPlugin(() => {
  document.addEventListener('touchstart', () => {}, { passive: true })
})
