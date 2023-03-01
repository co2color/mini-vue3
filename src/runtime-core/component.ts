import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    props: {},
    setupState: {},
    emit: () => {},
    // isMounted: false,
  }
  component.emit = emit.bind(null, component) as any // 第一个参数是this，第二个参数是用户传入的参数
  return component
}

export function setupComponent(instance) {
  // ...
  initProps(instance, instance.vnode.props)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.vnode.type
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

  const { setup } = Component

  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    })
    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}
function finishComponentSetup(instance: any) {
  const Component = instance.type
  instance.render = Component.render
}
