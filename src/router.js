import VueRouter from 'vue-router'
import NotFount from './components/NotFount'
import Register from './components/Register'
import Login from './components/Login'
import Workshop from './containers/workshop'
import WorkshopList from './containers/workshopList'

const routes = [
    { path: '/', redirect: '/register' },
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { path: '/workshop', component: Workshop },
    { path: '/workshops', component: WorkshopList },
    { path: '*', component: NotFount}
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.NODE_ENV == 'production' ? '/workshop' : '/',
    routes
})

export default router