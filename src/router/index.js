import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/pages/HomeView.vue'

//importaciones vistas de arboles
import Roble from '../components/pages/RobleView.vue'
import Panama from '../components/pages/ArbolPanamaView.vue'
import Guachapali from '../components/pages/GuachaView.vue'
import Toreta from '../components/pages/ToretaView.vue'
import Cabresto from '../components/pages/CabrestoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //Vistas de arboles
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
    },
    {
      path: '/toreta',
      name: 'toreta',
      component: Toreta
    },
    {
      path: '/cabresto',
      name: 'cabresto',
      component: Cabresto
    }
  ]
})

export default router
