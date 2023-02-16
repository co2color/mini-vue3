import { h } from '../../lib/guide-mini-vue.esm.js'

export const App = {
  render() {
    return h(
      'div',
      {
        id: 'root',
        class: ['red'],
      },
      [
        h('p', { class: 'yellow' }, 'p-test'),
        h('h3', { class: 'red' }, 'h3——test'),
      ]
    )
  },
  setup() {
    return {
      // msg: 'Hello World',
    }
  },
}
