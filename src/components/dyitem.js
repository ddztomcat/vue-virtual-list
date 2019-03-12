export default {
  name: 'virtual-list-dynamic-item',
  install(vue) {
    vue.component(this.name, this)
  },
  inject: ['parentRef'],
  props: {
    index: Number
  },
  methods: {
    getBounds() {
      return this.$el.getBoundingClientRect()
    }
  },
  created() {
    
  },
  mounted() {
    this.$nextTick(() => {
      let bd = this.getBounds()
      this.parentRef.$emit('childUpdate', this.index, bd)
    })
  },
  updated() {
    this.$nextTick(() => {
      let bd = this.getBounds()
      this.parentRef.$emit('childUpdate', this.index, bd)
    })
  },
  render(h) {
    return h('div',{
      ref: 'item-wrap'
    },this.$slots.default)
  }
}