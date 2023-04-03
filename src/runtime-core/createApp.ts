import { createVNode } from './vnode'
export function createAppAPI(render) {
  return function createApp(rootComponent: {
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
}
