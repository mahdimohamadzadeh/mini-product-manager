let products = [
  {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    category: 'Electronics',
    description: 'High-performance laptop for professionals',
    stock: 15
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    price: 29.99,
    category: 'Accessories',
    description: 'Ergonomic wireless mouse',
    stock: 50
  },
  {
    id: 3,
    name: 'USB-C Cable',
    price: 12.99,
    category: 'Cables',
    description: 'High-speed USB-C charging cable',
    stock: 100
  },
  {
    id: 4,
    name: 'Monitor',
    price: 299.99,
    category: 'Electronics',
    description: '4K Ultra HD Monitor',
    stock: 20
  },
  {
    id: 5,
    name: 'Keyboard',
    price: 79.99,
    category: 'Accessories',
    description: 'Mechanical keyboard with RGB',
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

  const { id } = event.context.params as { id: string }
  const productId = parseInt(id, 10)

  if (isNaN(productId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Product ID must be a valid number'
      }
    })
  }

  const productIndex = products.findIndex(p => p.id === productId)

  if (productIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      data: {
        message: `Product with ID ${productId} not found`
      }
    })
  }

  const body = await readBody(event)

  const updatedProduct = {
    ...products[productIndex],
    ...(body.name && { name: body.name }),
    ...(body.price !== undefined && { price: body.price }),
    ...(body.category && { category: body.category }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.stock !== undefined && { stock: body.stock })
  }

  if (updatedProduct.price < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Price cannot be negative'
      }
    })
  }

  if (updatedProduct.stock < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Stock cannot be negative'
      }
    })
  }

  products[productIndex] = updatedProduct

  return {
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct
  }
})
