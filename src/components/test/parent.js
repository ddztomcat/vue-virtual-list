let parent = {
  name: 'test-parent',
  install(vue) {
    vue.component(this.name, this)
  },
  data() {
    return {
      zent: {
        x: 1,
        y: 2
      },
      room: {
        a: 1,
        b: 2
      }
    }
  },
  render(h) {
    return h('div', [this.$scopedSlots.default(this.zent), this.$scopedSlots.room(this.room)])
  }
}
let child = {
  name: 'test-child',
  install(vue) {
    vue.component(this.name, this)
  },
  data() {
    return {
    }
  },
  render(h) {
    return h('div', [
      h('test-parent', {
        scopedSlots: {
          default: function(props) {
            return h('span', props.x)
          },
          room(props) {
            return h('span', props.b)
          }
        }
      })
    ])
  }
}
export { parent, child }
