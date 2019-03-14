import Vue from 'vue'
import App from './App.vue'
import VirtualScroll from './components/index'
import { VirtualList, VirtualListItem } from '../lib/index'
import Vconsole from 'vconsole'
import { parent, child } from './components/test/parent'
new Vconsole()
Vue.config.productionTip = false
Vue.use(VirtualScroll)
  .use(VirtualList)
  .use(VirtualListItem)
  .use(parent)
  .use(child)
new Vue({
  render: h => h(App)
}).$mount('#app')
