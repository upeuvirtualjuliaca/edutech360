import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/modules/home/pages/HomePage.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/modules/admin/pages/AdminLoginPage.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/modules/admin/pages/AdminPage.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.init()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'admin-login' }
  }
  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return { name: 'admin' }
  }
})

export default router
