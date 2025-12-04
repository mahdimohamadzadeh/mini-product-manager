<template>
  <div class="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <div class="flex items-center justify-center w-12 h-12 mx-auto bg-blue-600 rounded-lg">
          <span class="text-2xl font-bold text-white">P</span>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Product Manager</h2>
        <p class="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div
          v-if="errorMessage"
          class="p-4 rounded-md bg-red-50"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <div
          v-if="successMessage"
          class="p-4 rounded-md bg-green-50"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="w-5 h-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-800">{{ successMessage }}</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              v-model="credentials.username"
              type="text"
              required
              class="block w-full px-3 py-2 mt-1 placeholder-gray-400 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{
                'border-red-300 bg-red-50': fieldErrors.username,
                'border-gray-300': !fieldErrors.username
              }"
              placeholder="Enter your username"
              :disabled="isLoading"
            />
            <p v-if="fieldErrors.username" class="mt-1 text-sm text-red-600">
              {{ fieldErrors.username }}
            </p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              required
              class="block w-full px-3 py-2 mt-1 placeholder-gray-400 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{
                'border-red-300 bg-red-50': fieldErrors.password,
                'border-gray-300': !fieldErrors.password
              }"
              placeholder="Enter your password"
              :disabled="isLoading"
            />
            <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-600">
              {{ fieldErrors.password }}
            </p>
          </div>

          
        </div>
        <button
          type="submit"
          :disabled="isLoading || !isFormValid"
          class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Sign in</span>
          <span v-else class="flex items-center">
            <svg class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
        </button>
      </form>

      <div class="p-4 rounded-md bg-blue-50">
        <h3 class="text-sm font-medium text-blue-900">Demo Credentials</h3>
        <p class="mt-2 text-xs text-blue-700">
          <span class="font-semibold">Username:</span> demo<br />
          <span class="font-semibold">Password:</span> password123
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '~/core/composables/auth/useAuth'
import { useRouter } from 'vue-router'
import type { AuthCredentials } from '~/core/composables/auth/types'

definePageMeta({
  layout: 'blank',
   middleware: 'auth'
})

const { login } = useAuth()
const router = useRouter()

const credentials = ref<AuthCredentials>({
  username: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})


const validateUsername = (username: string): string | null => {
  if (!username) return 'Username is required'
  if (username.length < 3) return 'Username must be at least 3 characters'
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores'
  return null
}

const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return null
}

const isFormValid = computed(() => {
  return credentials.value.username && 
         credentials.value.password &&
         !fieldErrors.value.username &&
         !fieldErrors.value.password
})


const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  fieldErrors.value = {}

  
  const usernameError = validateUsername(credentials.value.username)
  const passwordError = validatePassword(credentials.value.password)

  if (usernameError) fieldErrors.value.username = usernameError
  if (passwordError) fieldErrors.value.password = passwordError

  if (!isFormValid.value) return

  isLoading.value = true
  try {
    const response = await login(credentials.value.username, credentials.value.password)
    
    successMessage.value = `Welcome back, ${response.user.username}!`
    
    credentials.value = {
      username: '',
      password: ''
    }
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await router.push('/products')
  } catch (error: any) {
    errorMessage.value = error?.message || 'Invalid username or password'
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped></style>
