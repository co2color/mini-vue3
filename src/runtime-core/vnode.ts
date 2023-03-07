import { ShapeFlags } from '../shared/ShapeFlags'

export function createVNode(type, props?, children?) {
  // ...
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type),
  }
  if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  } else {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }

  // 组件+children object
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof vnode.type === 'object') {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }
  return vnode
}

export function getShapeFlag(type) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}
