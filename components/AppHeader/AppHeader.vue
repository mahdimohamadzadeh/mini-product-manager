<script setup lang="ts">
import { useAuth } from '~/core/composables/auth/useAuth';

</script>

<template>
  <header class="fixed top-0 w-full bg-white border-b border-gray-200 shadow-md">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
            <span class="text-xl font-bold text-gray-900">Product Manager</span>
        </div>

        <nav class="items-center hidden space-x-1 md:flex">
          <NuxtLink
            to="/products"
            class="px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:text-gray-900 hover:bg-gray-100"
            active-class="text-blue-700 bg-blue-100"
          >
            Products
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:text-gray-900 hover:bg-gray-100"
            active-class="text-blue-700 bg-blue-100"
          >
            Login
          </NuxtLink>
        </nav>

        <div class="items-center hidden space-x-4 md:flex">
          <NuxtLink
            to="/products/create"
            class="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Create Product
          </NuxtLink>
          <button
            @click="useAuth().logout()"
            class="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
          >
            logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
