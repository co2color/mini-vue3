import { mutableHandlers, readonlyHandlers } from './baseHandlers'

function createActiveObject(raw: any, baseHandlers: any) {
  return new Proxy(raw, baseHandlers)
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

// 对于这段代码：
/* 
const user = reactive({ age: 19 })
let double
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
