import { isObject } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp'
import { Fragment, Text } from './vnode'

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options

  function render(vnode, container: HTMLElement) {
    // ...
    patch(vnode, container, null)
  }

  // patch函数的作用就是将vnode渲染到container中，即container.appendChild(true_node)
  function patch(vnode, container, parentComponent) {
    // ...
    const { type, shapeFlag } = vnode

    // if type=== Fragment
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break
      case Text:
        processText(vnode, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent)
        }
        break
    }
  }

  function processFragment(vnode, container, parentComponent) {
    mountChildren(vnode, container, parentComponent)
  }
  function processText(vnode, container) {
    const textNode = (vnode.el = document.createTextNode(vnode.children))
    container.appendChild(textNode)
  }
  function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent)
  }
  function mountElement(vnode: any, container: any, parentComponent) {
    const el = (vnode.el = hostCreateElement(vnode.type))
    const { children, shapeFlag } = vnode
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 如：h('p', {}, 'Tag <p>'s content'),children就是'Tag <p>'s content'
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 如：h('p', {}, [h('span', {}, 'span1 content'), h('span', {}, 'span2 content')])
      // children就是[h('span', {}, 'span1 content'), h('span', {}, 'span2 content')]
      mountChildren(vnode, el, parentComponent)
    }

    if (vnode.props) {
      const { props } = vnode
      for (const key in props) {
        const val = props[key]
        // const isOn = (key: string) => /^on[A-Z]/.test(key)
        // if (isOn(key)) {
        //   const event = key.slice(2).toLowerCase()
        //   el.addEventListener(event, val)
        //   continue
        // }
        // el.setAttribute(key, val)
        hostPatchProp(el, key, val)
      }
    }
    // container.appendChild(el)
    hostInsert(el, container)
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((child) => {
      patch(child, container, parentComponent)
    })
  }

  function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent)
  }

  function mountComponent(initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent) // 创建组件实例

    setupComponent(instance) // 调用App中的setup
    setupRenderEffect(instance, initialVNode, container) // 调用App中的render
  }
  function setupRenderEffect(instance, initialVNode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    patch(subTree, container, instance)
    // 如果所有element都已经初始化完成
    initialVNode.el = subTree.el
  }
  return {
    createApp: createAppAPI(render),
  }
}
