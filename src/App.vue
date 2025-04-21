<template>
  <nav class="bg-gray-100 shadow-md p-4">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Logo -->
      <router-link to="/" class="text-2xl font-bold text-blue-700">Kanban Board</router-link>

      <!-- Hamburger Menu -->
      <button
        class="md:hidden text-blue-700 focus:outline-none"
        @click="isMenuOpen = !isMenuOpen"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Nav Links (Desktop) -->
      <div class="hidden md:flex space-x-6 items-center">
        <router-link v-if="isLoggedIn" to="/BoardList" class="text-gray-800 hover:text-blue-700">BoardList</router-link>
        <router-link v-if="!isLoggedIn" to="/register" class="text-gray-800 hover:text-blue-700">Register</router-link>
        <router-link v-if="!isLoggedIn" to="/" class="text-gray-800 hover:text-blue-700">Login</router-link>
        <button
          v-if="isLoggedIn"
          @click="handleSignOut"
          class="text-red-600 hover:text-red-700 font-medium"
        >
          Logout
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden mt-3 space-y-2 px-4">
      <router-link to="/" class="block text-gray-800 hover:text-blue-700">Home</router-link>
      <router-link v-if="isLoggedIn" to="/BoardList" class="block text-gray-800 hover:text-blue-700">BoardList</router-link>
      <router-link v-if="!isLoggedIn" to="/register" class="block text-gray-800 hover:text-blue-700">Register</router-link>
      <router-link v-if="!isLoggedIn" to="/" class="block text-gray-800 hover:text-blue-700">Login</router-link>
      <button
        v-if="isLoggedIn"
        @click="handleSignOut"
        class="block text-red-600 hover:text-red-700 font-medium"
      >
        Logout
      </button>
    </div>
  </nav>

  <router-view />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const isLoggedIn = ref(false);
const isMenuOpen = ref(false);
const router = useRouter();

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    isLoggedIn.value = false;
    isMenuOpen.value = false;
    router.push('/');
  });
};
</script>
