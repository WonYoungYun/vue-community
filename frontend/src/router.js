import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import store from './store'


Vue.use(Router)
Vue.prototype.$axios = axios;
const apiRootPath = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api/' : '/api'
Vue.prototype.$apiRootPath = apiRootPath
axios.defaults.baseURL = apiRootPath

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  const token = response.data.token

  if (token) localStorage.setItem('token', token)


  return response
}, function (error) {
  // Do something with response error
  switch (error.response.status) {
    case 400:
      store.commit('pop', { msg: `잘못된 요청입니다(${error.response.status})` })
      break;
    case 401:
      store.commit('delToken')
      store.commit('pop', { msg: `인증 오류입니다.(${error.response.data.msg})` })
      break;
    case 403:
      store.commit('pop', { msg: `이용 권한이 없습니다.(${error.response.data.msg})` })
      break;
    default:
      store.commit('pop', { msg: `알수없는 오류입니다.(${error.response.data.msg})` })
  }
  return Promise.reject(error)
})


//네비게이션 가드 철저히 
//마이페이지에 접속하여 토큰과 정보를 받아와라

const pageCheck = (to, from, next) => {
  if (!localStorage.getItem('token')) {
    store.commit('pop', { msg: "잘못된 접근입니다.", color: 'warning' })
    return next(false)
  }
  axios.get(`${apiRootPath}user`)
    .then(r => {
      if (!r.data.success) throw new Error(r.data.msg)
      next();
    })
    .catch(e => {
      if (!e.response) store.commit('pop', { msg: e.message, color: 'warning' })
      next(false)
    })
}





export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: '메인 화면',
      component: () => import('./views/BoardList.vue')
    },
    {
      path: '/sign',
      name: '로그인',
      component: () => import('./views/Sign.vue')
    },
    {
      path: '/register',
      name: '회원가입',
      component: () => import('./views/Register.vue')
    },
    {
      path: '/board/:name',
      name: '게시판',
      component: () => import('./views/board/Index.vue'),
    },
    {
      path: '/article/:id',
      name: '게시글',
      component: () => import('./views/article/Index.vue'),
    },
    {
      path: '/myconfig',
      name: '내 설정',
      component: () => import('./views/user/UserConfig.vue'),
      beforeEnter: pageCheck
    },
    {
      path: '/myboard',
      name: '내 게시판',
      component: () => import('./views/user/UserBoard.vue'),
      beforeEnter: pageCheck
    },

    {
      path: '/mycomments',
      name: '내가 쓴 댓글',
      component: () => import('./views/user/UserComments.vue'),
      beforEnter: pageCheck
    },
    {
      path: '/manage/users',
      name: '유저 현황',
      component: () => import('./views/manage/Users.vue'),
      beforeEnter: pageCheck
    },
    {
      path: '/manage/boards',
      name: '게시판 현황',
      component: () => import('./views/manage/Boards.vue'),
      beforeEnter: pageCheck
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '*',
      name: 'e404',
      component: () => import('./views/E404.vue')
    }

  ]
})
