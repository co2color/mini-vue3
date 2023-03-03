import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  render() {
    const foo = h(Foo, {
      propsValue: 'bob',
      onAdd: (a, b) => {
        console.log('onAdd', a, b)
      },
      onAddFoo: (a, b) => {
        console.log('onAddFoo', a, b)
      },
    })
    return h(
      'div',
      {
        class: 'App',
      },
      [foo]
    )
  },
  setup() {
    return {}
  },
}
