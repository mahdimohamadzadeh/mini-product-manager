// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  
  devtools: { 
    enabled: true 
  },
  
  typescript: {
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        strict: true
      }
    }
  },

  modules: ['@nuxt/image'],
  
  css: ['~/assets/styles/main.scss'],
  
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  alias: {
    "@components": "/core/components",
  }
})
