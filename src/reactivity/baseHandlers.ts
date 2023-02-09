import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'

function createGetter(isReadonly: boolean) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE && !isReadonly) {
      return true
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter(isReadonly: boolean) {
  return function set(target, key, value) {
    if (isReadonly) {
      console.warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`
      )
      return true
    }
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}

// 避免重复创建
const get = createGetter(false)
const set = createSetter(false)
const readonlyGet = createGetter(true)
const readonlySet = createSetter(true)

export const mutableHandlers = {
  get,
  set,
}
export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet,
}
