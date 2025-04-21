// File: src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';

import { initializeFirebase } from './services/firebaseService';

initializeFirebase();

const app = createApp(App);

app.use(router);
app.mount('#app');
