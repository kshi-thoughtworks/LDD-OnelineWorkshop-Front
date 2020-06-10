import Vue from 'vue'
import VueRouter from 'vue-router'
import { FormModel, message } from 'ant-design-vue';
import App from './App'
import router from './router'
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(FormModel)
Vue.prototype.$message = message

new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
