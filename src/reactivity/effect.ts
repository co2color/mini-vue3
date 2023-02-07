import { extend } from '../shared'

let currentEffect

class reactiveEffect {
  private _fn: any
  deps = []
  active = true
  onStop?: () => void
  public scheduler: Function | undefined
  // https://ts.xcatliu.com/advanced/class.html#%E5%8F%82%E6%95%B0%E5%B1%9E%E6%80%A7
  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }
  run() {
    currentEffect = this
    return this._fn()
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect: reactiveEffect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
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
  // 只有使用了effect，才会存在currentEffect
  if (!currentEffect) {
    return
  }
  dep.add(currentEffect)
  currentEffect.deps.push(dep)
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
  const eff = new reactiveEffect(fn, options?.scheduler)
  extend(eff, options)
  eff.run() // 执行effect的callback(即fn)
  const runner: any = eff.run.bind(eff)
  runner.effect = eff
  return runner
}

// runner = effect(callback)
// 因此effect返回的是runner，其中有effect这个属性
export function stop(runner) {
  runner.effect.stop()
}
