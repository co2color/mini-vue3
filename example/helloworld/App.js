import { h } from '../../lib/guide-mini-vue.esm.js'

export const App = {
  render() {
    return h(
      'div',
      {
        id: 'root',
        class: ['red'],
        onClick() {
          console.log('click')
        },
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
