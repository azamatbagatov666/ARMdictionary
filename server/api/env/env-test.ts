export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  return {
    siteUrl: config.public.siteUrl
  }
})