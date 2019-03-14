<template>
  <div id="app">
    <!-- <button @click="handleClick">点击</button> -->
    <!-- <virtual-list :size="30" :keep="10" :remUnit="0">
      <div class="item" v-for="item in items" :key="item.id">{{item.id}}</div>
    </virtual-list> -->
    <p>可变高度</p>
    <virtual-list
      :dynamic="true"
      :min-size="30"
      :total="items.length"
      height="200px"
      @reach-bottom="handleReachBottomDynamic"
      class="scroll"
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
    <div
      v-show="showLoading"
      class="loading"
    >
      <van-loading type="spinner" />
    </div>
    <p>固定高度</p>
    <virtual-list
      :min-size="30"
      :total="items1.length"
      height="300px"
      @reach-bottom="handleReachBottom"
      class="scroll"
    >
      <div
        class="item"
        v-for="item in items1"
        :key="item.id"
      >{{item.id}}</div>
    </virtual-list>
    <!-- <test-child></test-child> -->
    <div
      v-show="showLoading1"
      class="loading"
    >
      <van-loading type="spinner" />
    </div>

  </div>
</template>

<script>
import { Loading } from 'vant'
import {generateText} from './test/index'
import 'vant/lib/index.css'
import { setTimeout } from 'timers';

const hehe = (() => {
        let a = []
        for(let i = 0; i < 10000; i++)
        a.push({id: i,text: generateText()})
        return a
      })()
export default {
  name: 'app',
  data() {
    return {
      items: hehe.slice(0, 50),
      items1: hehe.slice(0, 1000),
      id: 50,
      id1: 1000,
      showLoading: false,
      showLoading1: false
    }
  },
  methods: {
    handleClick() {
      let n = Number(Math.ceil(Math.random() * 100))
      this.items = hehe.slice(0, n)
      // console.log(this.items)
    },
    handleReachBottomDynamic(e) {
      // console.log(e)
      this.showLoading = true
      this.items = this.items.concat(hehe.slice(this.id, this.id + 10))
      this.id += 10
      setTimeout(() => this.showLoading = false, 300)
    },
    handleReachBottom(e) {
      // console.log(e, 2)
      this.showLoading1 = true
      this.items1 = this.items1.concat(hehe.slice(this.id1, this.id1 + 10))
      this.id1 += 10
      setTimeout(() => this.showLoading1 = false, 300)
    }
  },
  components: {
    [Loading.name]: Loading
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
.scroll {
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
