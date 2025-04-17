<template>
    <div class="min-w-[18rem] bg-white rounded-lg shadow p-4">
      <h2 class="font-semibold text-lg mb-4">{{ column.name }}</h2>
      <div class="space-y-3">
        <Card v-for="card in cards" :key="card.id" :card="card" />
      </div>
      <div class="mt-4 text-sm text-blue-500 cursor-pointer">+ Add Card</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { db, collection, getDocs, testUserId } from '../services/firebaseService';
  import Card from './Card.vue';
  
  const props = defineProps({
    column: Object,
    boardId: String
  });
  
  const cards = ref([]);
  
  onMounted(async () => {
  const snapshot = await getDocs(collection(db, `users/${testUserId}/boards/${props.boardId}/columns/${props.column.id}/cards`));
  cards.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

  </script>