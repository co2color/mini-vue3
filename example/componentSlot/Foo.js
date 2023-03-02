import { h } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup() {
    return {}
  },
  render() {
    const foo = h('div', {}, 'foo')
    return h('div', {}, [foo, this.$slots])
  },
}
