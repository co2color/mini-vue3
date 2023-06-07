import { createVNode } from './vnode'

// createAppAPI()返回一个新函数，该新函数有一个参数 rootComponent
export function createAppAPI(render) {
  return function createApp(rootComponent: {
    name: string
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

// 上面用一个简单的例子解释：
// function aa(a) {
//   return function xx(b) {
//     console.log(a, b)
//   }
// }

// const obj = {
//   tt: aa(1),
// }

// obj.tt(3) // 1 3  这里的tt的参数3，就是xx的参数b
