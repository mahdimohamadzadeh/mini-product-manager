export default defineEventHandler(async (event) => {
  // Clear the token cookie
  deleteCookie(event, 'auth_token')

  return {
    message: 'Logged out successfully'
  }
})
