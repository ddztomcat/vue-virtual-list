<template>
  <div id="app">
    <button @click="handleClick">点击</button>
    <!-- <virtual-list :size="30" :keep="10" :remUnit="0">
      <div class="item" v-for="item in items" :key="item.id">{{item.id}}</div>
    </virtual-list> -->
    <virtual-list
      :dynamic="true"
      :minSize="30"
      :total="items.length"
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
    <br />
    <virtual-list
      :minSize="30"
      :total="items.length"
    >
      <div
        class="item"
        v-for="item in items"
        :key="item.id"
      >{{item.id}}</div>
    </virtual-list>
    <!-- <test-child></test-child> -->
    
  </div>
</template>

<script>
import {generateText} from './test/index'
const hehe = (() => {
        let a = []
        for(let i = 0; i < 100; i++)
        a.push({id: i,text: generateText()})
        return a
      })()
export default {
  name: 'app',
  data() {
    return {
      items: hehe
    }
  },
  methods: {
    handleClick() {
      let n = Number(Math.ceil(Math.random() * 100))
      this.items = hehe.slice(0, n)
      console.log(this.items)
    }
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.item {
  min-height: 30px;
  /* line-height: 30px; */
  border-bottom: 1px solid burlywood;
}
body {
  font-size: 12px;
}
</style>
