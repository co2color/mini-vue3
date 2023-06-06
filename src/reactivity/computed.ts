import { reactiveEffect } from './effect'

// _dirty作用：
// 当在callback第一次get的时候，会执行getter，然后_dirty会被置为false
// 此后执行computed.get，就不run getter了，而是直接返回_value
// 当getter这个callback里面的依赖变化的时候（即触发reactive/ref的set），
// 此时会执行scheduler，而scheduler里面会把_dirty置为true
// 此后执行computed.get，此时_dirty为true，就会run getter，拿到最新的值
class ComputedRefImpl {
  private _value: any
  private _effect: reactiveEffect
  private _dirty = true
  constructor(getter) {
    this._effect = new reactiveEffect(getter, () => {
      // 这是一个scheduler，作用是：当依赖的值发生变化的时候，
      // 会执行这个函数，而不是执行run进而执行getter
      // 也就是说，有了这个scheduler，getter里面的依赖的值发生变化的时候，
      // 就不会执行getter这个callback了
      if (!this._dirty) {
        this._dirty = true
      }
    })
  }

  get value() {
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter: Function) {
  const computedRef = new ComputedRefImpl(getter)
  return computedRef
}
