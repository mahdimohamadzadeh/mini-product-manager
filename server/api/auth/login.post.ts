export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.username || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required',
      data: {
        message: 'Username and password are required'
      }
    })
  }

  const validUsername = 'demo'
  const validPassword = 'password123'

  if (body.username !== validUsername || body.password !== validPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
      data: {
        message: 'Invalid username or password'
      }
    })
  }
  const token = btoa(JSON.stringify({
    username: body.username,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  }))

  setCookie(event, 'auth_token', token, {
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  })

  return {
    user: {
      id: '1',
      username: body.username,
      email: `${body.username}@example.com`
    },
    token
  }
})

