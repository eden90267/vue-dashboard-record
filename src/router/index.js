import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: 'login'
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {requiresAuth: true} // 路由訊息
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
          meta: {requiresAuth: true},
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const api = `${process.env.API_PATH}/api/user/check`;
    axios.post(api).then((res) => {
      console.log(res.data);
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
