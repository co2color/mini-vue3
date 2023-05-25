import { effect } from '../reactivity/effect'
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
    patch(null, vnode, container, null)
  }

  // patch函数的作用就是将vnode渲染到container中，即container.appendChild(true_node)
  function patch(n1, n2, container, parentComponent) {
    // ...
    const { type, shapeFlag } = n2

    // if type=== Fragment
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
        break
    }
  }

  function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n2, container, parentComponent)
  }
  function processText(n1, n2, container) {
    const textNode = (n2.el = document.createTextNode(n2.children))
    container.appendChild(textNode)
  }
  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container)
    }
  }

  function patchElement(n1, n2, container) {
    console.log('n1', n1)
    console.log('n2', n2)
    // todo ：对比props和children
    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    const el = (n2.el = n1.el)
    patchProps(el, oldProps, newProps)
  }

  function patchProps(el, oldProps, newProps) {
    for (const key in newProps) {
      const prevProp = oldProps[key]
      const nextProp = newProps[key]
      if (prevProp !== nextProp) {
        hostPatchProp(el, key, prevProp, nextProp)
      }
    }
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
        hostPatchProp(el, key, null, val)
      }
    }
    // container.appendChild(el)
    hostInsert(el, container)
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((child) => {
      patch(null, child, container, parentComponent)
    })
  }

  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent(initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent) // 创建组件实例

    setupComponent(instance) // 调用App中的setup
    setupRenderEffect(instance, initialVNode, container) // 调用App中的render
  }
  function setupRenderEffect(instance, initialVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        console.log('init')
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        patch(null, subTree, container, instance)
        // 如果所有element都已经初始化完成
        initialVNode.el = subTree.el
        instance.isMounted = true
      } else {
        // 更新
        console.log('update')
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevTree = instance.subTree // 上一次的subTree
        instance.subTree = subTree
        patch(prevTree, subTree, container, instance)
      }
    })
  }
  return {
    createApp: createAppAPI(render),
  }
}
