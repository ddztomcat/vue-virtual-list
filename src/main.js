import Vue from 'vue'
import App from './App.vue'
import VirtualScroll from './components/index'
import VirtualScrollDynamic from './components/dyindex'
import VirtualScrollDynamicItem from './components/dyitem'
import {parent, child} from './components/test/parent'

Vue.config.productionTip = false
Vue.use(VirtualScroll).use(VirtualScrollDynamic).use(VirtualScrollDynamicItem).use(parent).use(child)
new Vue({
  render: h => h(App),
}).$mount('#app')
