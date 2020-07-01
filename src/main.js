import Vue from 'vue'
import 'vue-tsx-support/enable-check'
import VueRouter from 'vue-router'
import { Dropdown, FormModel, Icon, message, Menu, Modal } from 'ant-design-vue';
import App from './App'
import router from './router'
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Dropdown)
Vue.use(FormModel)
Vue.use(Icon)
Vue.use(Menu)
Vue.use(Modal)
Vue.prototype.$message = message
Vue.prototype.$info = Modal.info

new Vue({
  router,
  render: createElement => createElement(App)
}).$mount('#app')
