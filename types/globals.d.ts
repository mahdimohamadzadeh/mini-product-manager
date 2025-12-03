/// <reference types="nuxt" />
/// <reference path="../.nuxt/nuxt.d.ts" />
/// <reference path="../.nuxt/imports.d.ts" />

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __NUXT__: any
  }
}

export {}



