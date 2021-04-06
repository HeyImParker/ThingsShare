import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Item from '../views/Item.vue'
import Profile from '../views/Profile.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/item/:id',
    name: 'Item',
    componet: Item
  },
  {
    path: '/profile',
    name: 'Profile',
    componet: Profile
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
