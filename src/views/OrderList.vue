<template>
  <div class="p-8">
    <div class="max-w-6xl">
      <h1 class="text-4xl font-bold text-slate-900 mb-4 capitalize">Orders - {{ category }}</h1>
      <p class="text-lg text-slate-600 capitalize">Order list for {{ category }} category</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const category = route.params.category
</script>
