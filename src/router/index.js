import { createRouter, createWebHistory } from 'vue-router'

import Roble from '../components/pages/RobleView.vue'
import Panama from '../components/pages/ArbolPanamaView.vue'
import Home from '../components/pages/HomeView.vue'
import Guachapali from '../components/pages/GuachaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/roble',
      name: 'roble',
      component: Roble
    },
    {
      path: '/panama',
      name: 'panama',
      component: Panama
    },
    {
      path: '/guachapali',
      name: 'guachapalo',
      component: Guachapali
    },
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})

export default router
