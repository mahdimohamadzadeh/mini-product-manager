import { computed } from 'vue'
import type { AuthResponse, UseAuthReturn } from './types'

export function useAuth(): UseAuthReturn {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7
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
        if (process.client) {
          localStorage.setItem('auth_token', data.value.token)
          localStorage.setItem('auth_user', JSON.stringify(data.value.user))
        }else {
          const event = useEvent()
          setCookie(event, 'auth_token', data.value.token, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: true,
            sameSite: 'lax'
          })
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

