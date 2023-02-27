import { h } from '../../lib/guide-mini-vue.esm.js'

export const App = {
  render() {
    return h(
      'div',
      {
        id: 'root',
        class: ['red'],
      },
      'hi, ' + this.msg
    )
  },
  setup() {
    return {
      msg: 'Hello World',
    }
  },
}
