<template>
  <div>
    <h1>Edit Product</h1>
    <form>
      <input type="text" placeholder="Product Name" v-model="name">
      <input type="number" placeholder="Product Price" v-model="price">
      <button type="submit">Edit</button>
    </form>
  </div>
</template>

<script setup>
const route = useRoute()
const id = route.params.id
</script>

<style lang="scss" scoped></style>
