<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 class="text-2xl font-semibold text-blue-700 mb-6 text-center">Create an account</h1>
  
        <!-- Error Alert -->
        <div v-if="errMsg" class="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300">
          {{ errMsg }}
        </div>
  
        <div class="space-y-4">
          <input
            type="text"
            v-model="email"
            placeholder="Email"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
  
          <input
            type="password"
            v-model="password"
            placeholder="Password"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
  
          <button
            @click="register"
            class="w-full bg-blue-700 text-white font-medium py-2 rounded-md hover:bg-blue-800 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const errMsg = ref('');
  const router = useRouter();
  
  const register = () => {
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
      .then(() => {
        router.push('/BoardList');
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errMsg.value = 'Email is already registered.';
            break;
          case 'auth/invalid-email':
            errMsg.value = 'Invalid email address.';
            break;
          case 'auth/weak-password':
            errMsg.value = 'Password should be at least 6 characters.';
            break;
          default:
            errMsg.value = 'Something went wrong. Please try again.';
            break;
        }
      });
  };
  </script>
  