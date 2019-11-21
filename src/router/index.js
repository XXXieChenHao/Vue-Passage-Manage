import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  rederect: '/login'
},
{
  path: '/home',
  name: 'home',
  component: () => import('@/views/home'),
  children: [{
    path: '/article',
    name: 'article',
    component: () => import('@/views/article')
  }, {
    path: '/articleadd',
    name: 'articleadd',
    component: () => import('@/views/articleadd')
  }, {
    path: '/articleedit/:aid',
    name: 'articleedit',
    component: () => import('@/views/articleedit')
  }, {
    path: '/account',
    name: 'account',
    component: () => import('@/views/account')
  }, {
    path: '/material',
    name: 'material',
    component: () => import('@/views/material')
  }
  ]
},
{
  path: '/login',
  name: 'login',
  component: () => import('@/views/login')
}
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  let unserinfo = window.sessionStorage.getItem('userinfo')
  if (to.path !== '/login' && !unserinfo) {
    return next('/login')
  }
  next()
})

export default router
