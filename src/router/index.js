import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      meta: {redirectIfAuth: true},
      component: () => import('../views/auth/Login.vue')
    },
    {
      path: '/registro',
      name: 'Registro',
      component: () => import('../views/auth/Registro.vue')
    },
    {
      path: '/admin',
      component: () => import('../layout/AppLayout.vue'),
      meta: {requireAuth: true},
      children: [
        {
          path: 'perfil',
          name: 'Perfil',
          meta: {requireAuth: true},
          component: () => import('../views/admin/Perfil.vue')
        },
        {
          path: 'usuarios',
          name: 'Usuario',
          meta: {requireAuth: true},
          component: () => import('../views/admin/Usuario.vue')
        },
        {
          path: 'producto',
          name: 'Producto',
          meta: {requireAuth: true},
          component: () => import('../views/admin/Producto.vue')
        },
        {
          path: 'pedido',
          name: 'Pedido',
          meta: {requireAuth: true},
          component: () => import('../views/admin/pedido/Pedido.vue')
        },
        {
          path: 'pedido/nuevo',
          name: 'Nuevo',
          mata: {requireAuth: true},
          component: () => import('../views/admin/pedido/PedidoNuevo.vue')
        }
        
      ]
    },
    
  ]
})

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("access_token")
  console.log(to)
  if(to.meta.requireAuth){
    if(!token){
      next({name: 'Login'})
    }else{

      return next()
    }
  }

  if(to.meta.redirectIfAuth && token){
    return next({name: 'Perfil'})
  }else{

    return next();
  }
})

export default router
