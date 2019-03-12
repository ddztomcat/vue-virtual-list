export default {
  name: 'virtual-list',
  install(vue) {
    vue.component(this.name, this)
  },
  props: {
    size: Number,
    keep: Number,
    remUnit: {
      type: Number,
      default: 0
    },
    throttle: {
      type: Number,
      default: 200
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
      total: 0,
      realHeight: 0
    }
    this.__index = 0
  },
  methods: {
    getRealRenderVNodes() {
      let t = []
      for (let i = this.__base.currentStart; i <= this.__base.currentEnd; i++) {
        t.push(this.$slots.default[i])
      }
      return t
    },
    recalculateBase() {
      if(!this.__base.total) this.__base.total = this.$slots.default.length
      if(!this.__base.realHeight) this.__base.realHeight = this.__base.total * this.size
      this.__base.currentStart = this.__index
      this.__base.currentEnd = this.__index + this.keep + this.cache - 1
      this.__base.paddingTop = this.__index * this.size
      this.__base.paddingBottom = this.__base.realHeight - this.size * (this.keep + this.cache) - this.__base.paddingTop
    },
    scroll(e) {
      let sp = e.target.scrollTop
      let index = Math.floor(sp / this.size)
      this.__index = index
      if(this.__index + this.keep >= this.__base.currentEnd || this.__index <= this.__base.currentStart) {
        this.$forceUpdate()
      }
    },
    getThrottle(fn) {
      let t = Date.now()
      let th = null
      return (e) => {
        let p = Date.now()
        if(p- t >= this.throttle) {
          clearTimeout(th)
          fn.call(this, e)
          t = p
        }else {
          clearTimeout(th)
          th = setTimeout(() => {
            fn.call(this, e)
          }, this.throttle)
        }
      }
    },
    pxOrRem(px) {
      // console.log(px, (px / this.remUnit))
      return this.remUnit > 0 ? (px / this.remUnit).toFixed(8) + 'rem' : px + 'px'
    }
  },
  updated() {

  },
  mounted() {

  },
  render(h) {
    this.recalculateBase()
    let realRenders = this.getRealRenderVNodes()
    let p = this.__base
    // console.log(p, realRenders, this.$slots.default)
    return h(
      'div',
      {
        style: {
          height: this.pxOrRem(this.size * this.keep),
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
