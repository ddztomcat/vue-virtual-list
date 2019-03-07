import Vue from 'vue'
import App from './App.vue'
import VirtualScroll from './components/index'
Vue.config.productionTip = false
Vue.use(VirtualScroll)
new Vue({
  render: h => h(App),
}).$mount('#app')
