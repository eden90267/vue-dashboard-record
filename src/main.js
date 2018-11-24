// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import VeeValidate from 'vee-validate'
import zhTWValidate from 'vee-validate/dist/locale/zh_TW'

import App from './App'
import router from './router'
import './bus'
import currencyFilter from './filters/currency'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

Vue.use(VeeValidate)
VeeValidate.Validator.localize('zh_TW', zhTWValidate)

axios.defaults.withCredentials = true

Vue.component('Loading', Loading)
Vue.filter('currency', currencyFilter)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
