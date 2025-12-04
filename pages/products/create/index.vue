<template>
  <div class="min-h-screen ">
     <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Create Product</h1>
    </div>
    <form @submit.prevent="createProduct" class="flex flex-col gap-4">
      <input class="p-2 border border-gray-300 rounded" type="text" placeholder="Product Name" v-model="name">
      <select class="p-2 border border-gray-300 rounded" name="category" id="category" v-model="category">
        <option value="">Select Category</option>
        <option v-for="category in categories" :key="category.id" :value="category.name">{{ category.name }}</option>
      </select>
      <input class="p-2 border border-gray-300 rounded" type="text" placeholder="Product Price" v-model="price">
      <textarea class="p-2 border border-gray-300 rounded" type="text" placeholder="Product Description" v-model="description"/>
      <input class="p-2 border border-gray-300 rounded" type="text" placeholder="Product Stock" v-model="stock"/>

      <!-- Product Image Picker -->
      <BaseFilePicker v-model="image" accept="image/*" :imageOnly="true" label="Product Image" />

      <button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Create</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types/pages/products.type'

const name = ref('')
const price = ref('')
const category = ref('')
const description = ref('')
const stock = ref('')
const image = ref<File | File[] | null>(null)
const categories = ref<Category[]>([
  {
    id: 1,
    name: 'Electronics'
  },
  {
    id: 2,
    name: 'Clothing'
  },
  {
    id: 3,
    name: 'Books'
  }
])

const createProduct = () => {
  // For now just log collected values; image may be a File or array of Files.
  console.log('name:', name.value)
  console.log('price:', price.value)
  console.log('category:', category.value)
  console.log('description:', description.value)
  console.log('stock:', stock.value)
  console.log('image:', image.value)
}
</script>

<style lang="scss" scoped></style>
