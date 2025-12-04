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

  try {
    const formData = await readMultipartFormData(event)

    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          message: 'No file provided'
        }
      })
    }

    const fileField = formData.find(field => field.name === 'file')

    if (!fileField || !fileField.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          message: 'Invalid file field'
        }
      })
    }

    const filename = fileField.filename
    const fileData = fileField.data

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    const mimeType = fileField.type || 'application/octet-stream'

    if (!allowedMimes.includes(mimeType)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: {
          message: 'Invalid file type. Only image files are allowed.'
        }
      })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (fileData.length > maxSize) {
      throw createError({
        statusCode: 413,
        statusMessage: 'Payload Too Large',
        data: {
          message: 'File size exceeds 5MB limit'
        }
      })
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = filename.substring(filename.lastIndexOf('.'))
    const uniqueFilename = `product_${timestamp}_${randomStr}${ext}`

    // Simulate file upload - in production, you would save to storage service
    const mockUrl = `/uploads/${uniqueFilename}`

    return {
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: uniqueFilename,
        originalName: filename,
        size: fileData.length,
        mimeType: mimeType,
        url: mockUrl
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        message: 'Failed to upload image',
        error: error.message
      }
    })
  }
})
