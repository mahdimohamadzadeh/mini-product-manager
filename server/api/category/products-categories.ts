const categories = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    productCount: 2
  },
  {
    id: 2,
    name: 'Accessories',
    description: 'Computer and tech accessories',
    productCount: 2
  },
  {
    id: 3,
    name: 'Cables',
    description: 'Various types of cables and connectors',
    productCount: 1
  }
]

export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, 'auth_token')
  
  if (!authToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        message: 'Authentication token is required'
      }
    })
  }

  try {
    const decodedToken = JSON.parse(Buffer.from(authToken, 'base64').toString())
    
    if (decodedToken.exp && decodedToken.exp < Date.now()) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        data: {
          message: 'Token has expired'
        }
      })
    }
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        message: 'Invalid token format'
      }
    })
  }

  return {
    success: true,
    data: categories,
    count: categories.length
  }
})
