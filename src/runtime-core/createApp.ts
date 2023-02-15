import { render } from './render'
import { createVNode } from './vnode'

export function createApp(_rootComponent) {
  return {
    mount(_rootComponent) {
      const vnode = createVNode(_rootComponent)
      render(vnode, _rootComponent)
    },
  }
}
