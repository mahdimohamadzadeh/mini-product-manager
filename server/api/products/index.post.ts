let products = [
  {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    category: 'Electronics',
    stock: 15
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    price: 29.99,
    category: 'Accessories',
    stock: 50
  },
  {
    id: 3,
    name: 'USB-C Cable',
    price: 12.99,
    category: 'Cables',
    stock: 100
  },
  {
    id: 4,
    name: 'Monitor',
    price: 299.99,
    category: 'Electronics',
    stock: 20
  },
  {
    id: 5,
    name: 'Keyboard',
    price: 79.99,
    category: 'Accessories',
    stock: 35
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

  const body = await readBody(event)

  if (!body.name || !body.price || !body.category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Name, price, and category are required'
      }
    })
  }

  if (typeof body.name !== 'string' || typeof body.price !== 'number' || typeof body.category !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Invalid data types: name (string), price (number), category (string)'
      }
    })
  }
  
  const newProduct = {
    id: Math.max(...products.map(p => p.id), 0) + 1,
    name: body.name,
    price: body.price,
    category: body.category,
    stock: body.stock || 0
  }

  products.push(newProduct)

  return {
    success: true,
    message: 'Product created successfully',
    data: newProduct
  }
})
