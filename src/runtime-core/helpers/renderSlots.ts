import { Fragment, createVNode } from '../vnode'

// renderSlots返回的其实就是一个h函数
export function renderSlots(slots, name, props) {
  const slot = slots[name]
  console.log(slot, 'slot')

  if (slot) {
    if (typeof slot === 'function') {
      // slot(props)函数执行返回的是一个h函数的数组（normalizeSlotValue）
      // 其实在定义具名插槽时，有可能传的并不是数组，
      // 比如{ footer: () => h('p', {}, 'footer') }
      // slots()执行后返回的其实一个h函数，但是通过normalizeSlotValue最终转换成了数组
      return createVNode(Fragment, {}, slot(props))
    }
  }
}
