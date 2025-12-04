export default defineNuxtRouteMiddleware((to, from) => {
  debugger
  let authToken: string | Ref<string | null> = ''
  if (process.client) {
    authToken = localStorage.getItem('auth_token')
  } else{
    authToken = useCookie<string | null>('auth_token')
  }
  
  const publicPages = ['/login']
  const isLoggedIn = !!(unref(authToken))

  if (!publicPages.includes(to.path) && !isLoggedIn) {
    return navigateTo('/login')
  }

  if (to.path === '/login' && isLoggedIn) {
    return navigateTo('/products')
  }
})
