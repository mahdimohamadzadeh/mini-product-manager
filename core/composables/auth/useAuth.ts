import { computed } from 'vue'
import type { AuthResponse, UseAuthReturn } from './types'

export function useAuth(): UseAuthReturn {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
  
  const login = async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await useFetch<AuthResponse>('/api/auth/login', { 
        method: 'POST', 
        body: { username, password }
      })
      
      if (error.value) {
        const errorMessage = error.value?.data?.message || 'Login failed'
        throw new Error(errorMessage)
      }
      
      if (data.value?.token) {
        token.value = data.value.token
        // Also store in localStorage for persistence across tabs
        if (process.client) {
          localStorage.setItem('auth_token', data.value.token)
          localStorage.setItem('auth_user', JSON.stringify(data.value.user))
        }
      }
      
      return data.value as AuthResponse
    } catch (err: any) {
      throw new Error(err.message || 'Failed to login')
    }
  }
  
  const logout = (): void => {
    token.value = null
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }
  
  const isLoggedIn = computed<boolean>(() => !!token.value)
  
  return { token, login, logout, isLoggedIn }
}

