// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  target: 'static',
  baseURL: '/',
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  components: [
    {
      path: '~/components/auth',
      pathPrefix: false
    }
  ],
  plugins: ['~/plugins/router-loading.client.ts', '~/plugins/pinia.ts'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
  ],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'https://fight-club-nqfh.onrender.com',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },
   pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
  dir: {
    directives: 'directives',
  },
})