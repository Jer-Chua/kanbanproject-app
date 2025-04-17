<template>
    <div class="bg-gray-100 rounded p-3 shadow-sm hover:shadow-md">
      <p class="font-medium">{{ card.title }}</p>
      <p class="text-sm text-gray-500">{{ card.description }}</p>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({ card: Object });
  </script>