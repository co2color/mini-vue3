import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  render() {
    const foo = h(
      Foo,
      {},
      {
        // 第三个参数，具名插槽
        header: h('p', {}, 'header'),
        footer: h('p', {}, 'footer'),
      }
    )
    // h函数的第1个参数如果是个对象，那么就会被当做组件来处理（processComponent）
    // 这时候第三个 参数children就会被当做组件的插槽，也就是initSlots(instance, instance.vnode.children)
    // 将Chilren传给initSlots，然后在initSlots中将children赋值给instance

    // 但如果第三个参数是字符串，那么说明第一个参数必定是个element Tag，
    // 那么就会被当做普通的element来处理（执行processElement），也就是document.createElement(tag)
    return h(
      'div',
      {
        class: 'root',
      },
      [foo]
    )
  },
  setup() {
    return {}
  },
}
