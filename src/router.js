import VueRouter from 'vue-router'
import Register from './components/Register'
import Login from "./components/Login"

const routes = [
    { path: '/', redirect: '/register' },
    { path: '/register', component: Register },
    { path: '/login', component: Login },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
