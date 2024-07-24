import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '主页',
    component: () => import('../page/HomePage.vue'),
    redirect:'/item',
    children:[
      {
        path: '/item',
        name: '首页',
        component: () => import('../components/Item.vue')
      },
      {
        path: '/product',
        name: '商品',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../page/ProductPage.vue')
      },
      {

        path:'/types',
        name:'分类',
        component:() => import('../page/TypePage.vue')
      },

    ]
  },
  {
    path: '/login',
    name: '登录',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../page/LoginPage.vue')
  },
  {
    path:'/reg',
    name:'注册',
    component:() => import('../page/RegPage.vue')
  },
  {
    path:'/chat',
    name:'聊天',
    component:() => import('../page/ChatPage.vue')
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
