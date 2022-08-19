import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home/HomeView.vue')
    },
    {
      path: '/hello',
      name: 'hello',
      component: () => import('../views/Hello/HelloView.vue')
    },
  ]
})

export default router
