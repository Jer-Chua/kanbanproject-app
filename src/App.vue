<template>
  <div>
    <nav class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <router-link to="/" class="text-lg font-bold">Kanban</router-link>
      <div class="flex items-center gap-4">
        <span v-if="user">Hi, {{ user.displayName || user.email }}</span>
        <button v-if="user" @click="logout" class="text-sm">Logout</button>
        <button v-else @click="showLogin = true" class="text-sm">Login</button>
      </div>
    </nav>
    <router-view />
    <LoginModal v-if="showLogin" @close="showLogin = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from './store/userStore';
import LoginModal from './components/auth/LoginModal.vue';

const showLogin = ref(false);
const userStore = useUserStore();
const user = computed(() => userStore.user);

function logout() {
  userStore.logout();
}
</script>