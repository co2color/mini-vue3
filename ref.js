let currentEffect = null

class Dep {
  constructor(val) {
    this.effects = new Set()
    this._val = val
  }
  get value() {
    // Dep的实例在被读取的时候（dep.value），调用addEffect()，将当前的effect添加到effects中
    this.addEffect()
    return this._val
  }
  set value(newval) {
    this._val = newval
    this.notifyEffect()
  }
  // 添加effect
  addEffect() {
    console.log(currentEffect, 'currentEffect')
    if (currentEffect) {
      this.effects.add(currentEffect)
    }
  }
  // 触发effect
  notifyEffect() {
    this.effects.forEach((effect) => effect())
  }
}

function effectWatch(effect) {
  currentEffect = effect
  effect() // 执行，如果函数内的语句有dep.value，就会触发get，从而触发addEffect
  currentEffect = null
}

const dep = new Dep(10)

const callback = () => {
  console.log(dep.value)
}

// effectWatch(callback)
dep.value = 20 // 触发set，从而触发notifyEffect，遍历effects，最终执行callback函数，打印20

/*
  解析：
  1. effectWatch(callback)执行，执行callback函数，其函数内部若有dep.value， 则触发get，从而触发addEffect，将callback添加到effects集合中。
  2. dep.value = 20，触发set，从而触发notifyEffect，遍历effects，执行callback函数。
  至此，每当dep.value被set后就会触发callback函数。
*/

// vue3 reactive

function getDep(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new WeakMap()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }
  return dep
}

const targetMap = new WeakMap() //key是对象，value是一个Map

function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      console.log('get')
      const dep = getDep(target, key)
      dep.addEffect()
      const res = Reflect.get(target, key)
      return res
    },
    set(target, key, value) {
      console.log('set')
      const dep = getDep(target, key)
      const res = Reflect.set(target, key, value)
      dep.notifyEffect() // 必须在set之后，否则会导致死循环（copilot说的）
      return res
    },
  })
}

const user = reactive({ age: 19 })

let double
effectWatch(() => {
  console.log(user.age, 'user.age')
})
user.age = 20
