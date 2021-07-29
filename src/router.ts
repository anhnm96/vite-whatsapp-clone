import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('./pages/Home.vue') }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
