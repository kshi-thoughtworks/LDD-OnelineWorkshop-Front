import VueRouter from 'vue-router'
import NotFount from './containers/NotFount'
import Register from './containers/Register'
import Login from './containers/Login'
import Workshop from './containers/workshop'
import WorkshopList from './containers/workshopList'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { path: '/workshops', component: WorkshopList },
    { path: '/workshops/:workshopId', component: Workshop, name: 'workshop' },
    { path: '*', component: NotFount}
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.NODE_ENV == 'production' ? '/workshop' : '/',
    routes
})

export default router