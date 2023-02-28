import { h } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  render() {
    // 子组件接收父组件传递的 props，里面有this.count
    return h('div', {}, 'Foo:' + this.count)
  },
  setup(props) {
    // console.log('Foo setup', props)
  },
}
