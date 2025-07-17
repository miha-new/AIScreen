import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import Template from '@/views/TemplateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { requiresAuth: false },
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { layout: 'AdminLayout', requiresAuth: true },
    },
    {
      path: '/template/:id',
      name: 'template',
      component: Template,
      meta: { layout: 'AdminLayout', requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: {
        path: '/',
        replace: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (!to.meta.requiresAuth && token) {
    next('/')
  } else {
    next()
  }
})

export default router
