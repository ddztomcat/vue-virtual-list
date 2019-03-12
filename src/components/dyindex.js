export default {
  name: 'virtual-list-dynamic',
  install(vue) {
    vue.component(this.name, this)
  },
  provide() {
    return { parentRef: this }
  },
  props: {
    minSize: Number,
    total: Number,
    keep: {
      type: Number,
      default: 10
    },
    throttle: {
      type: Number,
      default: 20
    },
    dynamic: {
      type: Boolean,
      default: false
    },
    cache: {
      type: Number,
      default: 10
    }
  },
  created() {
    this.__base = {
      currentStart: 0,
      currentEnd: this.keep + this.cache - 1,
      paddingTop: 0,
      paddingBottom: 0,
      total: this.total,
      realHeight: 0
    }
    this.__index = 0
    this.__itemsSize = new Array(this.__base.total)
    if (this.dynamic) {
      this.$on('childUpdate', this.childUpdate)
    } else {
      for (let i = 0; i < this.total; i++) {
        this.__itemsSize[i] = this.minSize
      }
    }
  },
  methods: {
    childUpdate(index, bd) {
      this.__itemsSize[index] = bd.height
      // console.log(index, bd)
    },
    getRealRenderVNodes() {
      let t = []
      for (let i = this.__base.currentStart; i <= this.__base.currentEnd; i++) {
        t.push(this.$slots.default[i])
      }
      return t
    },
    recalculateBase() {// 重新计算基础值
      this.__base.total = this.total
      this.__base.currentStart = this.__index
      this.__base.currentEnd = this.__index + this.keep + this.cache - 1

      let ph = 0,
        rh = 0,
        mh = 0
      for (let i = 0; i < this.__base.total; i++) {
        rh += this.__itemsSize[i] ? this.__itemsSize[i] : this.minSize
        if (i < this.__index) {
          ph += this.__itemsSize[i] ? this.__itemsSize[i] : this.minSize
        } else if (i >= this.__index && i <= this.__base.currentEnd) {
          mh += this.__itemsSize[i] ? this.__itemsSize[i] : this.minSize
        }
      }
      this.__base.realHeight = rh
      this.__base.paddingTop = ph
      this.__base.paddingBottom = rh - mh - ph
    },
    getIndex(scrollTop) { // 获取滑动后视口第一个vnode下标
      let h = 0
      for (let i = 0; i < this.__base.total; i++) {
        h += this.__itemsSize[i] ? this.__itemsSize[i] : this.minSize
        if (h >= scrollTop) return i
      }
      return this.__base.total - 1
    },
    scroll(e) {
      let sp = e.target.scrollTop
      let index = this.getIndex(sp)
      this.__index = index
      if (
        this.__index + this.keep >= this.__base.currentEnd ||
        this.__index <= this.__base.currentStart
      ) {
        this.$forceUpdate()
      }
    },
    getThrottle(fn) {// 节流 默认每20ms 触发一次滚动，但保证最后一个滚动一定会触发
      let t = Date.now()
      let th = null
      return e => {
        let p = Date.now()
        if (p - t >= this.throttle) {
          clearTimeout(th)
          fn.call(this, e)
          t = p
        } else {
          clearTimeout(th)
          th = setTimeout(() => {
            fn.call(this, e)
          }, this.throttle)
        }
      }
    },
    pxOrRem(px) {// rem 在font-size小数时 容易出现偏差 保留px
      return px + 'px'
    }
  },
  updated() {},
  mounted() {},
  render(h) {
    this.recalculateBase()
    let realRenders = this.getRealRenderVNodes()
    let p = this.__base

    return h(
      'div',
      {
        style: {
          height: this.pxOrRem(this.minSize * this.keep),
          overflow: 'auto'
        },
        on: {
          scroll: this.throttle ? this.getThrottle(this.scroll) : this.scroll
        }
      },
      [
        h(
          'div',
          {
            style: {
              paddingTop: this.pxOrRem(p.paddingTop),
              paddingBottom: this.pxOrRem(p.paddingBottom)
            }
          },
          realRenders
        )
      ]
    )
  }
}
