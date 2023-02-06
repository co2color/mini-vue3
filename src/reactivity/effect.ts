let currentEffect

class ReactiveEffect {
  private _fn
  constructor(fn) {
    this._fn = fn
  }
  run() {
    currentEffect = this
    this._fn()
  }
}

const targetMap = new Map() // 存target
export function track(target, key) {
  // target->key->dep
  // 1.存target
  // 2.存key
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map() // 存key
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  dep.add(currentEffect)
}

export function trigger(target, key) {
  // 1.找到target
  // 2.找到key
  // 3.找到dep
  // 4.执行dep
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  for (let e of dep) {
    e.run()
  }
}

export function effect(fn) {
  const eff = new ReactiveEffect(fn)
  eff.run()
}
