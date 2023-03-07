import { createVNode } from '../vnode'

export function renderSlots(slots, name, props) {
  const slot = slots[name]
  // 如果slot是个函数

  if (slot) {
    if (typeof slot === 'function') {
      return createVNode('div', {}, slot(props))
    }
    return createVNode('div', {}, slot)
  }
}
