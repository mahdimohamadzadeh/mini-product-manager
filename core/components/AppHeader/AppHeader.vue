<template>
  <header class="bg-white border-b border-gray-200 shadow-md">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900">
            Product Manager
          </NuxtLink>
        </div>

        <nav class="items-center hidden space-x-1 md:flex">
          <NuxtLink
            to="/"
            class="px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:text-gray-900 hover:bg-gray-100"
            active-class="text-blue-700 bg-blue-100"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:text-gray-900 hover:bg-gray-100"
            active-class="text-blue-700 bg-blue-100"
          >
            Products
          </NuxtLink>
        </nav>

        <div class="items-center hidden space-x-4 md:flex">
          <NuxtLink
            v-if="!isLoggedIn"
            to="/login"
            class="px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:text-gray-900 hover:bg-gray-100"
          >
            Login
          </NuxtLink>
          
          <NuxtLink
            v-if="isLoggedIn"
            to="/products/create"
            class="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Create Product
          </NuxtLink>

          <button
            v-if="isLoggedIn"
            @click="handleLogout"
            class="px-4 py-2 text-sm font-medium text-red-600 transition-colors bg-red-50 rounded-lg hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from '~/core/composables/auth/useAuth'
import { useRouter } from 'vue-router'

const { logout, isLoggedIn } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  try {
    // Call logout endpoint to clear server-side cookie
    await $fetch('/api/auth/logout', { method: 'POST' })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Clear client-side state
    logout()
    // Redirect to login
    router.push('/login')
  }
}
</script>
