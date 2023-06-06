import { isObject } from '../shared'
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from './baseHandlers'

export const ReactiveFlags = {
  IS_REACTIVE: '__v_isReactive',
  IS_READONLY: '__v_isReadonly',
}

function createReactiveObject(raw: any, baseHandlers: any) {
  // raw必须是对象
  if (!isObject(raw)) {
    console.warn(`target ${raw}必须是对象`)
    return raw
  }
  return new Proxy(raw, baseHandlers)
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers)
}

export function isReactive(raw) {
  // 如果是,就会触发get，return true
  return !!raw[ReactiveFlags.IS_REACTIVE]
}
export function isReadonly(raw) {
  // 如果是,就会触发get，return true
  return !!raw[ReactiveFlags.IS_READONLY]
}

export function isProxy(raw) {
  return isReactive(raw) || isReadonly(raw)
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers)
}

// 对于这段代码：
/*
const user = reactive({ age: 19 })
effect(() => {
  console.log(user.age, 'user.age')
})
user.age = 20
*/

// 我的理解：
// 1.首先执行effect()这个函数
// 2.eff.run()执行上面effect()括号内的callback，
//   此时currentEffect就被赋值给了这个callback，
//   后面set的时候再触发该callback，
//   相当于又执行了effect()括号内的callback
//  3.执行callback的时候发现user.age被访问(被proxy劫持，触发get)了，于是执行track()
//  4.执行track()的时候发现currentEffect存在，
//    于是dep.add，即把callback添加到dep中，用于后面的trigger执行该callback
// 5. 执行user.age = 20的时候，触发set，于是执行trigger()
// 6. 执行trigger()的时候，遍历dep，执行dep中的callback，即effect()括号内的callback，最终实现了类似vue的响应性
