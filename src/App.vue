<template>
  <div id="app">
    <vue-virtual-scroll :size="30" :keep="10" :remUnit="0">
      <div class="item" v-for="item in items" :key="item">{{item}}</div>
    </vue-virtual-scroll>
  </div>
</template>

<script>


export default {
  name: 'app',
  data() {
    return {
      items: (() => {
        let a = []
        for(let i = 0; i < 10000; i++)
        a.push(i)
        return a
      })()
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
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid burlywood;
}
body {
  /* font-size: 12px; */
}
</style>
