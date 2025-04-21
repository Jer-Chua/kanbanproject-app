<template>
    <div class="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 border border-gray-200">
      <!-- Board Name -->
      <router-link
        :to="`/board/${board.id}`"
        class="text-xl font-semibold"
        style="color: #0A192F;"
      >
        {{ board.name }}
      </router-link>
  
      <!-- Edit & Delete Buttons -->
      <div class="flex justify-end gap-2">
        <button
          @click="$emit('edit', board)"
          title="Edit"
          class="transition"
          style="color: #0A192F;"
          @mouseover="event.target.style.color = '#64ffda'"
          @mouseleave="event.target.style.color = '#0A192F'"
        >
          <Pencil class="w-5 h-5" />
        </button>
        <button
          @click="$emit('delete', board)"
          title="Delete"
          class="transition text-red-500 hover:text-red-700"
        >
          <Trash class="w-5 h-5" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { Pencil, Trash } from 'lucide-vue-next'
  
  defineProps({
    board: Object
  })
  </script>
  