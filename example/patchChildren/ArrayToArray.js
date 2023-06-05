import { h, ref } from '../../lib/guide-mini-vue.esm.js'

const prevChildren = [
  h('p', { key: 'A' }, 'A'),
  h('p', { key: 'B' }, 'B'),
  h('p', { key: 'C' }, 'C'),
]
const nextChildren = [
  h('p', { key: 'A' }, 'A'),
  h('p', { key: 'D' }, 'D'),
  h('p', { key: 'C' }, 'C'),
]

export default {
  name: 'ArrayToArray',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange,
    }
  },
  render() {
    return this.isChange ? h('div', {}, nextChildren) : h('div', {}, prevChildren)
  },
}
