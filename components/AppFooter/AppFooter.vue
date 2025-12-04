<template>
  <footer class="w-full text-gray-100 bg-gray-900 ">
    <div class="px-4 mx-auto max-w-7xl">
      <div class="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <span class="text-xl font-bold text-white">Product Manager</span>
          </div>
        </div>

        <div>
          <h3 class="mb-4 text-lg font-semibold text-white">Products</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/products" class="text-gray-400 transition-colors hover:text-white">
                Browse All
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/products/create" class="text-gray-400 transition-colors hover:text-white">
                Create New
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
