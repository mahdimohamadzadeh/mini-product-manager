<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Products</h1>
        <p class="mt-2 text-gray-600">Manage and view all your products</p>
      </div>

      <!-- Placeholder Content -->
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Products list will appear here</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<style lang="scss" scoped></style>
