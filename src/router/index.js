import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import Search from '@/components/Search'
import MovieInfo from '@/components/MovieInfo'
import UserInfo from '@/components/UserInfo'
import Top from '@/components/Top'
import Post from '@/components/Post'
import Register from '@/components/Register'
import Admin from '@/components/Admin'
import AdminUser from '@/components/AdminUser'
import AdminComment from '@/components/AdminComment'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
    },
    {
      path:"/admin",
      name:"Admin",
      component:Admin,
      children: [
        {
          path:"/adminUser",
          name:"AdminUser",
          props: { page: 1 },
          component:AdminUser
        },
        {
          path:"/adminComment",
          name:"AdminComment",
          props: { page: 2 },
          component:AdminComment
        }
      ]
    }
  ]
})
