<template>
  <div class="order-list">
    <h1>Orders - {{ category }}</h1>
    <p>Order list for {{ category }} category</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const category = route.params.category
</script>

<style scoped>
.order-list {
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-transform: capitalize;
}
</style>
