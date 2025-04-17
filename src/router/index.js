import { createRouter, createWebHistory } from 'vue-router';
import BoardList from '../components/BoardList.vue';
import BoardView from '../components/BoardView.vue';
import { getAuth } from 'firebase/auth';

const routes = [
  { path: '/', name: 'BoardList', component: BoardList },
  { path: '/board/:id', name: 'BoardView', component: BoardView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) {
    next('/');
  } else {
    next();
  }
});

export default router;