import Vue from 'vue'
import App from './App.vue'
import VirtualScroll from './components/index'
import VirtualScrollDynamic from './components/dyindex'
import VirtualScrollDynamicItem from './components/dyitem'
Vue.config.productionTip = false
Vue.use(VirtualScroll).use(VirtualScrollDynamic).use(VirtualScrollDynamicItem)
new Vue({
  render: h => h(App),
}).$mount('#app')
