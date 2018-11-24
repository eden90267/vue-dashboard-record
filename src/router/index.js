import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'
import Orders from '@/components/pages/Orders'
import CustomerOrders from '@/components/pages/CustomerOrders'
import CustomerCheckout from '@/components/pages/CustomerCheckout'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '*',
      redirect: 'login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: {requiresAuth: true}, // 路由訊息
        },
        {
          path: 'orders',
          name: 'orders',
          component: Orders,
          meta: {requiresAuth: true}, // 路由訊息
        },
      ]
    },
    {
      path: '/',
      component: Dashboard,
      children: [
        {
          path: 'customer-orders',
          name: 'CustomerOrders',
          component: CustomerOrders
        },
        {
          path: 'customer-checkout/:orderId',
          name: 'CustomerCheckout',
          component: CustomerCheckout
        },
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const api = `${process.env.API_PATH}/api/user/check`;
    axios.post(api).then((res) => {
      if (res.data.success) {
        next();
      } else {
        next({
          path: '/login',
        });
      }
    })
  } else {
    next();
  }
});

export default router;
