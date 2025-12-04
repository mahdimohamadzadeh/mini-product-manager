<template>
  <div class="max-w-md p-6 mx-auto">
    <h1 class="mb-6 text-2xl font-bold">Create Product</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
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

      <button type="submit" :disabled="isLoading" class="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50">
        {{ isLoading ? 'Creating...' : 'Create' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useProductForm } from '~/core/composables/form/useProductForm'
import type { Category } from '~/types/pages/products.type'

definePageMeta({
  middleware: 'auth'
})

const { createProduct, errors, isLoading, fetchCategories } = useProductForm()

const formData = ref({
  name: '',
  price: '',
  category: '',
  stock: ''
})

const categories = ref<Category[]>([])

onMounted(async () => {
  categories.value = await fetchCategories()
})

const handleSubmit = async () => {
  await createProduct(formData.value)
  await navigateTo('/products')
}
</script>

<style lang="scss" scoped></style>
