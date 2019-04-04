import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import Search from '@/components/Search'
import MovieInfo from '@/components/MovieInfo'
import UserInfo from '@/components/UserInfo'
import Top from '@/components/Top'
import Post from '@/components/Post'
import Register from '@/components/Register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path:'/search/:name',
      name:'Search',
      component:Search
    },
    {
      path:'/info/:id',
      name:'MovieInfo',
      component:MovieInfo
    },
    {
      path:'/UserInfo/:userId',
      name:'UserInfo',
      component:UserInfo
    },
    {
      path:'/top',
      name:'Top',
      component:Top
    },
    {
      path:"/post",
      name:'Post',
      component:Post
    },
    {
      path:"/register",
      name:"Register",
      component:Register
    }
  ]
})
