<template>
  <div class="min-h-screen px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Products</h1>
        <button
          @click="navigateTo('/products/create')"
          class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>

      <input
        v-model="search"
        @input="filterProducts"
        type="text"
        placeholder="Search products..."
        class="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <div v-if="filteredProducts.length === 0" class="p-8 text-center bg-white rounded-lg shadow">
        <p class="text-gray-600 mb-4">No products found</p>
        <button
          @click="navigateTo('/products/create')"
          class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Add First Product
        </button>
      </div>

      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-900">{{ product.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ product.category }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">${{ product.price.toFixed(2) }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ product.stock }}</td>
                <td class="px-6 py-4 text-sm space-x-2">
                  <button
                    @click="editProduct(product.id)"
                    class="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(product.id, product.name)"
                    class="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 max-w-sm w-full">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Delete Product</h3>
          <p class="text-gray-600 mb-6">Are you sure you want to delete <span class="font-medium">{{ deleteProductName }}</span>?</p>
          <div class="flex gap-3">
            <button
              @click="showDeleteModal = false"
              class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              @click="deleteProduct"
              :disabled="store.loading"
              class="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {{ store.loading ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '~/stores/products'

definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const store = useProductStore()

const filteredProducts = ref<any[]>([])
const search = ref('')

const showDeleteModal = ref(false)
const deleteProductId = ref<number | null>(null)
const deleteProductName = ref('')

onMounted(async () => {
  await store.fetchProducts()
  filteredProducts.value = store.products
})

const filterProducts = () => {
  if (!search.value.trim()) {
    filteredProducts.value = store.products
  } else {
    const searchTerm = search.value.toLowerCase()
    filteredProducts.value = store.products.filter(p =>
      p.name.toLowerCase().includes(searchTerm)
    )
  }
}

const editProduct = (productId: number) => {
  router.push(`/products/create/${productId}`)
}

const confirmDelete = (productId: number, productName: string) => {
  deleteProductId.value = productId
  deleteProductName.value = productName
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  if (!deleteProductId.value) return

  try {
    await store.deleteProduct(deleteProductId.value)
    filterProducts()
    showDeleteModal.value = false
  } catch (error) {
    console.error('Failed to delete product:', error)
  }
}
</script>

<style lang="scss" scoped></style>
