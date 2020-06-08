import VueRouter from 'vue-router'
import Register from './components/Register'

const routes = [
    { path: '/', redirect: '/register' },
    { path: '/register', component: Register }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
