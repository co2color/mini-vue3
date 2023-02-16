import { render } from './render'
import { createVNode } from './vnode'

export function createApp(_rootComponent) {
  return {
    mount(rootContainer) {
      const vnode = createVNode(_rootComponent)
      render(vnode, rootContainer)
    },
  }
}
