import { extend } from '../shared'

let activeEffect
let shouldTrack = false

export class reactiveEffect {
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

  // run返回callback的结果
  run() {
    if (!this.active) {
      return this._fn()
    }
    shouldTrack = true

    // 执行的时候给全局的 activeEffect 赋值
    // 利用全局属性来获取当前的 effect
    activeEffect = this as any
    // 执行用户传入的 fn
    console.log('执行用户传入的 fn')
    // 这里之前一直纠结一个点，这个执行完，执行下面的activeEffect = undefined，那全过程activeEffect岂不是都为undefined了呢？
    // （错误在于，我忽略了const result = this._fn()，把他当成了一句代码，没有去看_fn的内部，其内部还有很多代码，不能视为一句）
    // 后来想明白了，执行this._fn()的时候，视角就应该跑去这个_fn的内部，如果这个_fn内部有Proxy.get/set被触发，就会track/trigger，
    // 而如若执行get导致执行track，那么track里面会执行isTracking，此时上面的activeEffect是被赋值给了this的，所以isTracking返回true，于是就会执行trackEffects，
    // 此时trackEffects里面的activeEffect并不是undefined，而是上面赋值的this。
    const result = this._fn()
    // 重置
    shouldTrack = false
    activeEffect = undefined

    return result
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

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function track(target, key) {
  if (!isTracking()) {
    return
  }
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
  trackEffects(dep)
}

export function trackEffects(dep) {
  // 用 dep 来存放所有的 effect

  // TODO
  // 这里是一个优化点
  // 先看看这个依赖是不是已经收集了，
  // 已经收集的话，那么就不需要在收集一次了
  // 可能会影响 code path change 的情况
  // 需要每次都 cleanupEffect
  // shouldTrack = !dep.has(activeEffect!);
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

export function trigger(target, key) {
  // 1.找到target
  // 2.找到key
  // 3.找到dep
  // 4.执行dep
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  triggerEffects(dep)
}

export function triggerEffects(dep) {
  // 执行收集到的所有的 effect 的 run 方法
  for (const effect of dep) {
    if (effect.scheduler) {
      // scheduler 可以让用户自己选择调用的时机
      // 这样就可以灵活的控制调用了
      // 在 runtime-core 中，就是使用了 scheduler 实现了在 next ticker 中调用的逻辑
      effect.scheduler()
    }
    else {
      effect.run()
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

// 1.new后，执行构造函数；
// 2.执行run方法，此时activeEffect = this；并且执行effect里面的callback
// 3.callback执行过程中，如果有Proxy.get/set被触发，就会track/trigger，此时activeEffect仍然为this，所以会执行trackEffects
// 4.执行完callback后，activeEffect = undefined
// 下一轮：当callback的监听的数据发生变化时，会因为触发set而执行trigger进而执行triggerEffects，然后触发run，进而执行callback

// runner = effect(callback)
// 因此effect返回的是runner，其中有effect这个属性
export function stop(runner) {
  runner.effect.stop()
}
