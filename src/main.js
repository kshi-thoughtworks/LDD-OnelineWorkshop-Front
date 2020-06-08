import Vue from 'vue'
import VueRouter from 'vue-router'
import { FormModel } from 'ant-design-vue';
import App from './App'
import router from './router'
import 'ant-design-vue/dist/antd.css';

Vue.use(VueRouter)
Vue.use(FormModel)
Vue.config.productionTip = false

new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
