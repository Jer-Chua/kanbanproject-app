<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 class="text-2xl font-semibold text-blue-700 mb-6 text-center">Sign in to your account</h1>
  
        <!-- Alert -->
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
            @click="signIn"
            class="w-full bg-blue-700 text-white font-medium py-2 rounded-md hover:bg-blue-800 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const errMsg = ref('');
  const router = useRouter();
  
  const signIn = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
      .then(() => {
        router.push('/BoardList');
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            errMsg.value = 'Invalid Email';
            break;
          case 'auth/user-not-found':
            errMsg.value = 'No account with that email was found';
            break;
          case 'auth/wrong-password':
            errMsg.value = 'Incorrect password';
            break;
          default:
            errMsg.value = 'Email or password was incorrect';
            break;
        }
      });
  };
  </script>
  