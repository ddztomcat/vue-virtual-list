# vue-virtual-list
vue 虚拟滚动组件

## 使用指南
```javascript
import { VirtualList, VirtualListItem } from 'virtual-list'

Vue.use(VirtualList).use(VirtualListItem)
```
## 代码演示
[预览地址](https://ddztomcat.github.io/vue-virtual-list/)
#### 固定高度
`height` 允许为字符串，合法值跟css height 属性一致
```html
    <virtual-list
      :min-size="30"
      :total="items.length"
      height="400px"
      @reach-bottom="handleReachBottom"
    >
      <div
        class="item"
        v-for="item in items"
        :key="item.id"
      >{{item.id}}</div>
    </virtual-list>
```

#### 可变高度
将`dynamic`置为true，并且用`virtual-list-item`包裹每一项
```html
    <virtual-list
      :dynamic="true"
      :min-size="30"
      :total="items.length"
      height="200px"
      @reach-bottom="handleReachBottomDynamic"
    >
      <virtual-list-item
        class="item"
        v-for="(item, ind) in items"
        :index="ind"
        :key="item.id"
      >
        {{item.id + ' ' + item.text}}
      </virtual-list-item>
    </virtual-list>
```
## VirtualList API
|参数|说明|类型|默认值|
|---|---|---|---|
|min-size|每一项（最小）高度|`Number`|`required`|
|total|列表的长度|`Number`|`required`|
|keep|可见列表项的个数|`Number`|`10`|
|height|视口的的高度|`Number String`|`keep * minSize`|
|bottomBlur|距离底部`bottomBlur`px时触发`reach-bottom`事件|`Number`|`30`|
|throttle|滚动事件节流|`Number`|`20`|
|dynamic|是否支持动态计算列表项的高度|`Boolean`|`false`|
|cache|缓存加载|`Number`|`10`|


## VirtualList 事件
|事件名|说明|参数|
|---|---|---|
|scroll|滚动事件|-|
|reach-bottom|到达底部|-|

## VirtualListItem API
|参数|说明|类型|默认值|
|---|---|---|---|
|index|在列表中的下标|`Number`|-|


## VirtualListItem 事件
暂无