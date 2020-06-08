import VueRouter from 'vue-router'
import HelloWorld from './components/HelloWorld'
import Register from './components/Register'

const routes = [
    { path: '/', component: HelloWorld },
    { path: '/register', component: Register }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
