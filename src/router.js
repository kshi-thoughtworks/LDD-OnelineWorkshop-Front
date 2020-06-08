import VueRouter from 'vue-router'
import Register from './components/Register'
import Login from "./components/Login"

const routes = [
<<<<<<< HEAD
    { path: '/', redirect: '/register' },
    { path: '/register', component: Register }
=======
    { path: '/', component: HelloWorld },
    { path: '/register', component: Register },
    { path: '/login', component: Login },
>>>>>>> 9682f1b... [wanlu] add login page
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
