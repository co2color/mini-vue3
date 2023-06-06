import { extend, isObject } from '../shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactive, readonly } from './reactive'

function createGetter(isReadonly: boolean, shallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE && !isReadonly) {
      return true
    }
    else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)
    if (shallow) {
      return res
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
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
        `Set operation on key "${String(key)}" failed: target is readonly.`,
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
const shallowReadonlyGet = createGetter(true, true)

export const mutableHandlers = {
  get,
  set,
}
export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet,
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
