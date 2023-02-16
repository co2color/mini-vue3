import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  // ...
  patch(vnode, container)
}
function patch(vnode, container) {
  // ...
  // 判断vnode是否是element
  if (typeof vnode.type === 'string') {
    // processElement(vnode, container)
  } else {
    processComponent(vnode, container)
  }
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}
function processElement(vnode, container) {
  // mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}
function setupRenderEffect(instance, container) {
  const subTree = instance.render()
  patch(subTree, container)
}
