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
      <input class="p-2 border border-gray-300 rounded" type="number" placeholder="Product Price" v-model="price">
      <button type="submit" class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Create</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '../types/products.type'
const name = ref('')
const price = ref(0)
const category = ref('')
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
  console.log(name.value, price.value, category.value)
}
</script>

<style lang="scss" scoped></style>
