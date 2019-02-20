import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VeeValidate from 'vee-validate'

import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import 'codemirror/lib/codemirror.css'
import { Editor, Viewer } from '@toast-ui/vue-editor'

//리캡챠를 사용하기위한 vue-recaptcha와 vue-plugin-load-script
import VueRecaptcha from 'vue-recaptcha'
import LoadScript from 'vue-plugin-load-script'

import * as cfg from './config'

Vue.config.productionTip = false
Vue.use(VeeValidate)

Vue.use(LoadScript)

Vue.component('editor', Editor)
Vue.component('viewer', Viewer)

Vue.prototype.$cfg = cfg.key

Vue.loadScript("https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit").then(() => {
  Vue.component('vue-recaptcha', VueRecaptcha)
})
  .catch(e => console.log(`google api load failed: ${e.message}`))



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
