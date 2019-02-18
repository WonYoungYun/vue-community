import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    user: {
      name: '손님',
      id: 'visitor',
      lv: 3,
      img: 'https://randomuser.me/api/portraits/lego/3.jpg'
    },
    sb: {
      act: false,
      msg: '',
      color: 'error'
    },
  },


  mutations: {
    getToken(state, user) {
      state.token = localStorage.getItem('token')
      state.user = user
    },
    delToken(state) {
      localStorage.removeItem('token')
      state.token = null
      state.user = {
        name: '손님',
        id: 'visitor',
        lv: 3,
        img: 'https://randomuser.me/api/portraits/lego/3.jpg'
      }
    },
    setProfile(state, profile) {
      state.user.img = profile
    },
    pop(state, d) {
      state.sb.msg = d.msg
      state.sb.color = d.color
      state.sb.act = false
      if (d.act === undefined) state.sb.act = true
    },
  },
  actions: {

  }
})
