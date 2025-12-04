<template>
  <div class="min-h-screen">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Products</h1>
      <p class="mt-2 text-gray-600">Manage and view all your products</p>
    </div>

    <div>
      <input
        type="text"
        placeholder="search by name"
        v-model="search"
        @input="filterProducts"
        class="p-2 my-4 border border-gray-300 rounded"
      />
    </div>
    <div>
      <table class="min-w-full rounded-lg shadow-md">
        <thead class="bg-gray-200">
          <tr class="flex justify-between">
            <th class="p-2">Product Name</th>
            <th class="p-2">Price</th>
            <th class="p-2">category</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y">
          <tr v-for="product in products" :key="product.id" class="flex justify-between">
            <td class="p-2">{{ product.name }}</td>
            <td class="p-2">{{ product.price }}</td>
            <td class="p-2">{{ product.category }}</td>
            <td class="flex gap-2 p-2">
              <button
                @click="editProduct(product)"
                class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                @click="deleteProduct(product.id)"
                class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Router } from 'vue-router'
import type { Product } from './types/products.type'

definePageMeta({
  middleware: 'auth'
})

const router: Router = useRouter()

const products = ref<Product[]>([
  {
    id: 1,
    name: 'Product 1',
    price: 100,
    category: 'Category 1'
  },
  {
    id: 2,
    name: 'Product 2',
    price: 200,
    category: 'Category 2'
  },
  {
    id: 3,
    name: 'Product 3',
    price: 300,
    category: 'Category 3'
  }
])

const search = ref<string>('')

const filterProducts = (): void => {
  products.value = products.value.filter((product) =>
    product.name.toLowerCase().includes(search.value.toLowerCase())
  )
}

const editProduct = (product: Product): void => {
  router.push(`/products/create/${product.id}`)
}

const deleteProduct = (id: number): void => {
  console.log(id)
}
</script>

<style lang="scss" scoped></style>
