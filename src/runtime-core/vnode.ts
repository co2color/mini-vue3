import { ShapeFlags } from '../shared/ShapeFlags'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export function createVNode(type, props?, children?) {
  // ...
  const vnode = {
    type,
    props,
    children,
    key: props && props.key,
    el: null,
    shapeFlag: getShapeFlag(type),
  }
  if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }
  else {
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

export function createTextVNode(text: string) {
  return createVNode(Text, {}, text)
}
export function normalizeVNode(child) {
  // 暂时只支持处理 child 为 string 和 number 的情况
  if (typeof child === "string" || typeof child === "number") {
    return createVNode(Text, null, String(child));
  } else {
    return child;
  }
}