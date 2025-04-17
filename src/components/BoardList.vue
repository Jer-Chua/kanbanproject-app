<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Your Boards</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <router-link
        v-for="board in boards"
        :key="board.id"
        :to="`/board/${board.id}`"
        class="p-4 bg-white rounded-lg shadow hover:shadow-lg"
      >
        {{ board.name }}
      </router-link>
      <div
        class="p-4 bg-blue-100 rounded-lg text-center cursor-pointer"
        @click="createBoard"
      >
        + Create New Board
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { db, auth } from '../services/firebaseService';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const router = useRouter();
const boards = ref([]);

onMounted(() => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(collection(db, 'boards'), where('owner', '==', user.uid));
  onSnapshot(q, (snapshot) => {
    boards.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });
});

async function createBoard() {
  const user = auth.currentUser;
  if (!user) {
    alert('Please login to create a board');
    return;
  }
  const docRef = await addDoc(collection(db, 'boards'), {
    name: 'Untitled Board',
    owner: user.uid,
    createdAt: Date.now(),
  });
  router.push(`/board/${docRef.id}`);
}
</script>