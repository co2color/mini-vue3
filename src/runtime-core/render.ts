import { isObject } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'

import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container: HTMLElement) {
  // ...
  patch(vnode, container)
}

// patch函数的作用就是将vnode渲染到container中，即container.appendChild(true_node)
function patch(vnode, container) {
  // ...
  // ShapeFlags
  const { shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container)
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container)
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}
function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type))
  const { children, shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // 如：h('p', {}, 'Tag <p>'s content'),children就是'Tag <p>'s content'
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 如：h('p', {}, [h('span', {}, 'span1 content'), h('span', {}, 'span2 content')])
    // children就是[h('span', {}, 'span1 content'), h('span', {}, 'span2 content')]
    mountChildren(vnode, el)
  }

  if (vnode.props) {
    const { props } = vnode
    for (const key in props) {
      const val = props[key]
      const isOn = (key: string) => /^on[A-Z]/.test(key)
      if (isOn(key)) {
        const event = key.slice(2).toLowerCase()
        el.addEventListener(event, val)
        continue
      }
      el.setAttribute(key, val)
    }
  }
  container.appendChild(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach((child) => {
    patch(child, container)
  })
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(initialVNode, container) {
  const instance = createComponentInstance(initialVNode)

  setupComponent(instance) // 调用App中的setup
  setupRenderEffect(instance, initialVNode, container) // 调用App中的render
}
function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  patch(subTree, container)
  // 如果所有element都已经初始化完成
  initialVNode.el = subTree.el
}
