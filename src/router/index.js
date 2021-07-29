import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/Login',
    component: Login
  },
  //  配置的根路径，默认显示页面,redirect:如果保持的是默认的路劲那么我们就跳转到登入页面 
  {
    path: '/',
    redirect: '/Login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../components/Hoem/welcome.vue')
      },
      {
        path: '/users',
        component: () => import('../components/user/users.vue')
      },
      {
        path: '/rights',
        component: () => import('../components/power/Rights.vue')
      },
      {
        path: '/roles',
        component: () => import('../components/power/roles.vue')
      },
      {
        path: '/categories',
        component: () => import('../components/goods/cate.vue')
      },
      {
        path: '/params',
        component: () => import('../components/goods/params.vue')
      },
      {
        path: '/goods',
        component: () => import('../components/goods/goods.vue')
      },
      {
        path: '/goods/add',
        component: () => import('../components/goods/add.vue')
      },
      {
        path: '/goods/editgoods',
        component: () => import('../components/goods/editgoods.vue')
      },
      {
        path: '/orders',
        component: () => import('../components/order/orders.vue')
      },
    ]
  }

]

const router = new VueRouter({
  routes
})

// 配置路由守卫
router.beforeEach((to, from, next) => {
  // 如果访问的是登入页面，那就放行
  if (to.path == '/Login') {
    return next()
  }
  // 如果用户未登入则跳转到login页面
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  if (!userInfo) {
    return next('/Login')
  }
  // 用户已经登入则就放xing
  next()
})
export default router
