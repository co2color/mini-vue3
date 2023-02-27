import { isObject } from '../shared'
import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container: HTMLElement) {
  // ...
  patch(vnode, container)
}
function patch(vnode, container) {
  // ...
  // check vnode（string or object）
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}
function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type))
  const { children } = vnode
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    children.forEach((child) => {
      patch(child, el)
    })
  }

  if (vnode.props) {
    for (const key in vnode.props) {
      el.setAttribute(key, vnode.props[key])
    }
  }
  container.appendChild(el)
}
function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance) // 调用App中的setup和render
  setupRenderEffect(instance, vnode, container)
}
function setupRenderEffect(instance, vnode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  patch(subTree, container)
  console.log(subTree);
  
  // 如果所有element都已经初始化完成
  vnode.el = subTree.el
}