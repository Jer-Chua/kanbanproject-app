import { initializeApp } from 'firebase/app';
import { getFirestore, collection,getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDUdNRia5HrRqLLUN7Vol-opGeENtggGJs',
  authDomain: 'kanban-app-59602.firebaseapp.com',
  projectId: 'kanban-app-59602',
  storageBucket: 'kanban-app-59602.appspot.com',
  messagingSenderId: '335894017042',
  appId: '1:335894017042:web:82871522360a64d299d4cb',
  measurementId: 'G-VKJ7LEX5KW',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const initializeFirebase = () => app;
export { db, auth, collection,getDocs };