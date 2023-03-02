import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  render() {
    const app = h('div', {}, 'App')
    const slots_comps = h('p', {}, '123')
    const foo = h(Foo, {}, slots_comps)
    return h('div', {}, [app, foo])
  },
  setup() {
    return {}
  },
}
