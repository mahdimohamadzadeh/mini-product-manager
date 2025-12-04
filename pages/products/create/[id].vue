<template>
  <div class="max-w-md p-6 mx-auto">
    <h1 class="mb-6 text-2xl font-bold">Edit Product</h1>

    <div v-if="loadingProduct" class="py-8 text-center">Loading...</div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium">Name *</label>
        <input v-model="formData.name" type="text" class="w-full px-3 py-2 border rounded" />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Price *</label>
        <input v-model="formData.price" type="number" step="0.01" class="w-full px-3 py-2 border rounded" />
        <p v-if="errors.price" class="mt-1 text-xs text-red-500">{{ errors.price }}</p>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Category *</label>
        <select v-model="formData.category" class="w-full px-3 py-2 border rounded">
          <option value="">Select category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
        <p v-if="errors.category" class="mt-1 text-xs text-red-500">{{ errors.category }}</p>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium">Stock</label>
        <input v-model="formData.stock" type="number" class="w-full px-3 py-2 border rounded" />
        <p v-if="errors.stock" class="mt-1 text-xs text-red-500">{{ errors.stock }}</p>
      </div>

      <button type="submit" :disabled="store.loading" class="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50">
        {{ store.loading ? 'Updating...' : 'Update' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useProductForm } from '~/core/composables/form/useProductForm'
import { useProductStore } from '~/stores/products'
import type { Category, Product } from '~/types/pages/products.type'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const productId = parseInt(route.params.id as string, 10)

const { errors, fetchCategories, fetchProduct } = useProductForm()
const store = useProductStore()

const formData = ref({
  name: '',
  price: '',
  category: '',
  stock: ''
})

const categories = ref<Category[]>([])
const loadingProduct = ref(false)

onMounted(async () => {
  try {
    loadingProduct.value = true
    const product: Product = await fetchProduct(productId)
    formData.value = {
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString()
    }

    categories.value = await fetchCategories()
  } catch (error: any) {
    console.error('Failed to load product:', error)
  } finally {
    loadingProduct.value = false
  }
})

const handleSubmit = async () => {
  try {
    // Basic validation
    if (!formData.value.name.trim()) {
      errors.name = 'Name is required'
      return
    }
    if (!formData.value.price || parseFloat(formData.value.price as any) <= 0) {
      errors.price = 'Price must be greater than 0'
      return
    }
    if (!formData.value.category) {
      errors.category = 'Category is required'
      return
    }

    await store.updateProduct(productId, {
      name: formData.value.name,
      price: parseFloat(formData.value.price as any),
      category: formData.value.category,
      stock: parseInt(formData.value.stock as any) || 0
    })
    
    await navigateTo('/products')
  } catch (error) {
    console.error('Failed to update product:', error)
  }
}
</script>

<style lang="scss" scoped></style>
