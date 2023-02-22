import { render } from './render'
import { createVNode } from './vnode'

export function createApp(rootComponent: {
  render: () => any
  setup: () => any
}) {
  return {
    mount(rootContainer: HTMLElement) {
      const vnode = createVNode(rootComponent)
      render(vnode, rootContainer)
    },
  }
}
