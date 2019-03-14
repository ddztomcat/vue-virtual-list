export default {
  name: 'virtual-list',
  install(vue) {
    vue.component(this.name, this)
  },
  provide() {
    return { parentRef: this }
  },
  props: {
    minSize: Number,
    total: Number,
    height: [String, Number],
    bottomBlur: {
      type: Number,
      default: 30
    },
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
    let viewHeight = this.getViewHeight()
    this.__base = {
      currentStart: 0,
      currentEnd: this.keep + this.cache - 1,
      paddingTop: 0,
      paddingBottom: 0,
      total: this.total,
      realHeight: 0,
      viewHeight
    }
    this.__lastTouch = 0
    this.__touchDirection = -1 // 滑动方向
    this.__lastScrollTop = 0
    this.__index = 0
    this.__viewPxHeight = 0
    this.__itemsSize = new Array(this.__base.total)
    if (this.dynamic) {
      this.$on('child-update', this.childUpdate)
    } else {
      for (let i = 0; i < this.total; i++) {
        this.__itemsSize[i] = this.minSize
      }
    }
    // 防止抖动
    this.judgeReachBottom = this.getDebounce(this.judgeReachBottom, 1000)
  },
  methods: {
    childUpdate(index, bd) {
      this.__itemsSize[index] = bd.height
      // console.log(index, bd)
    },
    getRealRenderVNodes() {
      let t = []
      for (
        let i = this.__base.currentStart;
        i <= this.__base.currentEnd && i < this.total;
        i++
      ) {
        t.push(this.$slots.default[i])
      }
      return t
    },
    getViewHeight() {
      let viewHeight = ''
      if (!isNaN(this.height)) {
        viewHeight = this.height + 'px'
      } else if (!this.height) {
        viewHeight = this.keep * this.minSize + 'px'
      } else {
        viewHeight = this.height
      }
      return viewHeight
    },
    recalculateBase() {
      // 重新计算基础值
      this.__base.total = this.total
      this.__base.currentStart = this.__index
      this.__base.currentEnd = this.__index + this.keep + this.cache - 1
      this.__base.viewHeight = this.getViewHeight()
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
    getIndex(scrollTop) {
      // 获取滑动后视口第一个vnode下标
      let h = 0
      for (let i = 0; i < this.__base.total; i++) {
        h += this.__itemsSize[i] ? this.__itemsSize[i] : this.minSize
        if (h >= scrollTop) return i
      }
      return this.__base.total - 1
    },
    judgeReachBottom(lsp, sp, e) {
      let allHeight = 0
      for (let i = 0; i < this.total; i++) {
        allHeight += this.__itemsSize[i] ? this.__itemsSize[i] : this.minSize
      }
      // console.log(this.__touchDirection, lsp, sp, e)
      if (
        sp + this.__viewPxHeight + this.bottomBlur >= allHeight &&
        (sp > lsp || this.__touchDirection === 1)
      ) {
        // console.log('reach bottom')
        this.$emit('reach-bottom', e)
      }
    },
    forceRender() {
      window.requestAnimationFrame(() => {
        this.$forceUpdate()
      })
    },
    scroll(e) {
      let sp = e.target.scrollTop
      let index = this.getIndex(sp)
      this.__index = index
      this.$emit('scroll', e)
      // console.log(index)
      this.judgeReachBottom(this.__lastScrollTop, sp, e)
      if (
        this.__index + this.keep >= this.__base.currentEnd ||
        this.__index <= this.__base.currentStart
      ) {
        this.$forceUpdate()
      }
      this.__lastScrollTop = sp
    },
    getDebounce(fn, time) {
      // 防止抖动
      let th = null
      return (...res) => {
        clearTimeout(th)
        th = setTimeout(() => {
          fn.call(this, ...res)
        }, time)
      }
    },
    getThrottle(fn, time) {
      // 节流 默认每20ms 触发一次滚动，但保证最后一个滚动一定会触发
      let t = Date.now()
      let th = null
      return e => {
        let p = Date.now()
        if (p - t >= time) {
          clearTimeout(th)
          fn.call(this, e)
          t = p
        } else {
          clearTimeout(th)
          th = setTimeout(() => {
            fn.call(this, e)
          }, time)
        }
      }
    },
    handleTouchMove(e) {
      let y = e.touches[0].pageY
      if (y - this.__lastTouch < 0) {
        this.__touchDirection = 1
      } else {
        this.__touchDirection = -1
      }
      this.__lastTouch = y
      // console.log(e.touches[0].pageY)
    },
    pxOrRem(px) {
      // rem 在font-size小数时 容易出现偏差 保留px
      return px + 'px'
    },
    getBounds() {
      return this.$el.getBoundingClientRect()
    }
  },
  updated() {},
  mounted() {
    this.$nextTick(() => {
      let bd = this.getBounds()
      // console.log(bd)
      this.__viewPxHeight = bd.height
    })
  },
  render(h) {
    this.recalculateBase()
    let realRenders = this.getRealRenderVNodes()
    let p = this.__base

    return h(
      'div',
      {
        style: {
          height: p.viewHeight,
          overflow: 'auto'
        },
        on: {
          scroll: this.throttle
            ? this.getThrottle(this.scroll, this.throttle)
            : this.scroll,
          touchmove: this.throttle
            ? this.getThrottle(this.handleTouchMove, this.throttle)
            : this.handleTouchMove
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
