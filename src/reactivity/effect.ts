let currentEffect

class ReactiveEffect {
  private _fn
  // https://ts.xcatliu.com/advanced/class.html#%E5%8F%82%E6%95%B0%E5%B1%9E%E6%80%A7
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    currentEffect = this
    return this._fn()
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
    if (e.scheduler) {
      e.scheduler()
    } else {
      e.run()
    }
  }
}

export function effect(fn, options: any = {}) {
  const eff = new ReactiveEffect(fn, options?.scheduler)
  eff.run()
  return eff.run.bind(eff)
}

class A {
  constructor(a, b) {}
  clog() {
    console.log(this)
  }
}
const aa = new A(1, 2)
