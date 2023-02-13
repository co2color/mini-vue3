import { hasChanged, isObject } from '../shared'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _rawValue: any
  private _value: any
  public dep
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
      triggerEffects(this.dep)
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

export function ref(value) {
  return new RefImpl(value)
}
