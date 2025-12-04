<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="mb-6 text-2xl font-bold">Edit Product</h1>

    <div v-if="loadingProduct" class="text-center py-8">Loading...</div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Name *</label>
        <input v-model="formData.name" type="text" class="w-full px-3 py-2 border rounded" />
        <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Price *</label>
        <input v-model="formData.price" type="number" step="0.01" class="w-full px-3 py-2 border rounded" />
        <p v-if="errors.price" class="text-red-500 text-xs mt-1">{{ errors.price }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Category *</label>
        <select v-model="formData.category" class="w-full px-3 py-2 border rounded">
          <option value="">Select category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
        <p v-if="errors.category" class="text-red-500 text-xs mt-1">{{ errors.category }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Stock</label>
        <input v-model="formData.stock" type="number" class="w-full px-3 py-2 border rounded" />
        <p v-if="errors.stock" class="text-red-500 text-xs mt-1">{{ errors.stock }}</p>
      </div>

      <button type="submit" :disabled="isLoading" class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
        {{ isLoading ? 'Updating...' : 'Update' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useProductForm } from '~/core/composables/form/useProductForm'
import type { Category, Product } from '~/types/pages/products.type'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const productId = parseInt(route.params.id as string, 10)

const { updateProduct, errors, isLoading, fetchCategories, fetchProduct } = useProductForm()

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
  await updateProduct(productId, {
    name: formData.value.name,
    price: formData.value.price,
    category: formData.value.category,
    stock: formData.value.stock
  })
  await navigateTo('/products')
}
</script>

<style lang="scss" scoped></style>
