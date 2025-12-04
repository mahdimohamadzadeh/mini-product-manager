import { defineStore } from 'pinia'
import type { Product } from '~/types/pages/products.type'

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const response: any = await $fetch('/api/products')
      products.value = response.data || []
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch products'
      products.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchProduct = async (id: number): Promise<Product | null> => {
    try {
      const response: any = await $fetch(`/api/products/${id}`)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch product'
      return null
    }
  }

  const createProduct = async (data: {
    name: string
    price: number
    category: string
    stock: number
  }) => {
    loading.value = true
    error.value = null
    try {
      const response: any = await $fetch('/api/products', {
        method: 'POST',
        body: data
      })
      products.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to create product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (
    id: number,
    data: {
      name: string
      price: number
      category: string
      stock: number
    }
  ) => {
    loading.value = true
    error.value = null
    try {
      const response: any = await $fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: data
      })
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to update product'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })
      products.value = products.value.filter(p => p.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete product'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
})
