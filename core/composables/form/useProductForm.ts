import type { Category, Product } from '~/types/pages/products.type'
import type { FormErrors, ProductFormState } from './types'



export const useProductForm = () => {
  const errors = ref<FormErrors>({})
  const isLoading = ref<boolean>(false)

  const validateForm = (formData: ProductFormState): boolean => {
    errors.value = {}
    let isValid = true

    if (!formData.name.trim()) {
      errors.value.name = 'Name required'
      isValid = false
    }

    if (!formData.price) {
      errors.value.price = 'Price required'
      isValid = false
    }

    if (!formData.category.trim()) {
      errors.value.category = 'Select category'
      isValid = false
    }

    if (formData.stock) {
      errors.value.stock = 'Stock required'
      isValid = false
    }

    return isValid
  }

  const createProduct = async (formData: ProductFormState): Promise<void> => {
    if (!validateForm(formData)) {
      throw new Error('Validation failed')
    }

    isLoading.value = true

    try {
      const response: any = await $fetch('/api/products', {
        method: 'POST',
        body: {
          name: formData.name,
          price: formData.price,
          category: formData.category,
          stock: formData.stock ? parseInt(formData.stock, 10) : 0
        }
      })

      await navigateTo('/products')
    } finally {
      isLoading.value = false
    }
  }

  const updateProduct = async (productId: number, formData: ProductFormState): Promise<void> => {
    if (!validateForm(formData)) {
      throw new Error('Validation failed')
    }

    isLoading.value = true

    try {
      const response: any = await $fetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: {
          name: formData.name,
          price: formData.price,
          category: formData.category,
          stock: formData.stock ? parseInt(formData.stock, 10) : 0
        }
      })

      await navigateTo('/products')
    } finally {
      isLoading.value = false
    }
  }

  const fetchCategories = async (): Promise<Category[]> => {
    try {
      const response: any = await $fetch('/api/category/products-categories')
      return response.data || []
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      return []
    }
  }

  const fetchProduct = async (id: number): Promise<Product> => {
    try {
      const response: any = await $fetch(`/api/products/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch product:', error)
      throw error
    }
  }

  return {
    errors,
    isLoading,
    createProduct,
    updateProduct,
    fetchCategories,
    fetchProduct
  }
}
