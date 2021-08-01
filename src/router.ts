import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./pages/Home.vue'),
    children: [
      {
        path: '/room/:id',
        component: () => import('./pages/Chat.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('./pages/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
