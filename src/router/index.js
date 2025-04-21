import {createRouter, createWebHistory} from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Register from '../views/Register.vue'
import SignIn from '../views/SignIn.vue'
import BoardList from '../views/BoardList.vue'
import BoardDetail from "../views/BoardDetail.vue";


const router = createRouter({
  history:createWebHistory(),
  routes: [
    {
      path: '/',
      beforeEnter: async (to, from, next) => {
        const auth = getAuth();
        const user = await new Promise((resolve) => {
          const removeListener = onAuthStateChanged(auth, (user) => {
            removeListener();
            resolve(user);
          });
        });
    
        if (user) {
          next('/BoardList'); // ✅ Redirect logged-in user to board list
        } else {
          next(); // Continue to SignIn view
        }
      },
      component: SignIn
    },
    {path: '/register', component: Register } ,
    {path: '/BoardList', component: BoardList, meta:{
      requiresAuth: true
    }},
    { path: '/board/:id', name: 'BoardDetail', component: BoardDetail, meta:{
      requiresAuth: true
    }
    }
  ]
})

const getCurrentUser = () =>{
  return new Promise((resolve, reject) =>{
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) =>{
        removeListener();
        resolve(user);
      },
      reject
    )
  })
}

router.beforeEach(async(to, from, next) =>{
  if(to.matched.some((record) => record.meta.requiresAuth)){
    if(await getCurrentUser()){
      next();
    }
    else{
      alert("You dont have access!");
      next("/");
    }
  }
  else{
    next();
  }
})

export default router;