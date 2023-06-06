import { hasChanged, isObject } from '../shared'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _rawValue: any
  private _value: any
  public dep
  public __v_isRef = true
  constructor(value) {
    this._rawValue = value
    // 如果是一个对象,需要用 reactive 包裹一下
    this._value = convert(value)
    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._value = convert(newValue)
      this._rawValue = newValue
      triggerRefValue(this)
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

export function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}
export function triggerRefValue(ref) {
  triggerEffects(ref.dep)
}

export function ref(value) {
  return new RefImpl(value)
}
export function isRef(value) {
  return !!value.__v_isRef
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

const shallowUnwrapHandlers = {
  get(target, key, receiver) {
    // 如果里面是一个 ref 类型的话，那么就返回 .value
    // 如果不是的话，那么直接返回value
    return unRef(Reflect.get(target, key, receiver))
  },
  set(target, key, value, receiver) {
    const oldValue = target[key]
    if (isRef(oldValue) && !isRef(value)) {
      return (target[key].value = value)
    }
    else {
      return Reflect.set(target, key, value, receiver)
    }
  },
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, shallowUnwrapHandlers)
}
