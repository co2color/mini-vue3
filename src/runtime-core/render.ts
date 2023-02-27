import { isObject } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'

import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container: HTMLElement) {
  // ...
  patch(vnode, container)
}
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
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }

  if (vnode.props) {
    for (const key in vnode.props) {
      el.setAttribute(key, vnode.props[key])
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

  setupComponent(instance) // 调用App中的setup和render
  setupRenderEffect(instance, initialVNode, container)
}
function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  patch(subTree, container)
  // 如果所有element都已经初始化完成
  initialVNode.el = subTree.el
}
