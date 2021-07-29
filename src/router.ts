import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import useAuthUser from './hooks/useAuthUser'

interface Permission {
  roles: string[]
  noAccessRedirect: string
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./pages/Home.vue'),
    // meta: {
    //   permission: {
    //     roles: ['user'],
    //     noAccessRedirect: '/login',
    //   },
    // },
  },
  {
    path: '/login',
    component: () => import('./pages/Login.vue'),
    meta: {
      permission: {
        roles: ['guest'],
        noAccessRedirect: '/',
      },
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const { user } = useAuthUser()
router.beforeEach((to, from, next) => {
  console.log(user.value)
  // If there are no permissions to check then proceed
  if (!to.meta.permission) return next()
  const { roles = [], noAccessRedirect } = to.meta.permission as Permission

  if (roles.includes('user') && user.value) return next()

  // routes for guests only
  if (!user.value && roles.includes('guest')) return next()
  // No access!
  next(noAccessRedirect)
})

export default router
