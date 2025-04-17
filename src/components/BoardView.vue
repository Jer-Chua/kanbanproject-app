<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Board</h1>
    <div class="flex space-x-4">
      <Column
        v-for="col in columns"
        :key="col.id"
        :column="col"
        :board-id="boardId"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../services/firebaseService';
import { collection, doc, onSnapshot, query, where, setDoc } from 'firebase/firestore';
import Column from './Column.vue';

const route = useRoute();
const boardId = route.params.id;
const columns = ref([]);

const colRef = collection(db, `boards/${boardId}/columns`);

onMounted(async () => {
  const q = query(colRef);
  onSnapshot(q, (snapshot) => {
    columns.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });

  // Create default columns if none exist
  setTimeout(async () => {
    if (columns.value.length === 0) {
      const defaultCols = [
        { name: 'To Do', color: 'blue' },
        { name: 'In Progress', color: 'yellow' },
        { name: 'Done', color: 'green' },
      ];
      for (const col of defaultCols) {
        await setDoc(doc(colRef), { name: col.name, color: col.color });
      }
    }
  }, 1000);
});
</script>
