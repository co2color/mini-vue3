import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  render() {
    return h(
      'div',
      {
        id: 'root',
        class: ['red'],
      },
      [
        h(Foo, {
          count: this.AppCount,
        }),
      ]
    )
  },
  setup() {
    return {
      AppCount: 1234,
      msg: 'Hello World',
    }
  },
}
