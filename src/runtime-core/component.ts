import { shallowReadonly } from '../reactivity/reactive'
import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    props: {},
    setupState: {},
    // isMounted: false,
  }
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
    const setupResult = setup(shallowReadonly(instance.props))
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
