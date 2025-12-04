// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  devtools: { 
    enabled: false
  },
  
  typescript: {
    typeCheck: false,
    strict: false
  },

  modules: ['@pinia/nuxt'],
  
  css: ['~/assets/styles/main.scss'],
  
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  imports: {
    autoImport: true
  },

  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/']
    },
    externals: {
      inline: ['vue']
    }
  }
})
