import { h } from '../../lib/guide-mini-vue.esm.js'

export const App = {
  render() {
    setTimeout(() => {
      console.log(this.$el)
    }, 1000)
    return h(
      'div',
      {
        id: 'root',
        class: ['red'],
      },
      [h('h1', null, 'Hxxx')]
    )
  },
  setup() {
    return {
      msg: 'Hello World',
    }
  },
}
