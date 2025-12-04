<template>
  <div class="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Product Manager</h2>
      </div>
      
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div
          v-if="errorMessage"
          class="p-4 rounded-md bg-red-50"
        >
          <div class="flex">
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
            Signing in...
          </span>
        </button>
      </form>

      <div class="p-4 rounded-md bg-blue-50">
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
