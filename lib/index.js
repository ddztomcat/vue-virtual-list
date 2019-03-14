import VirtualList from './dyindex'
import VirtualListItem from './dyitem'
const install = Vue => {
  Vue.components(VirtualList.name, VirtualList)
  Vue.components(VirtualListItem.name, VirtualListItem)
}
export default { install }
export { VirtualList, VirtualListItem }
