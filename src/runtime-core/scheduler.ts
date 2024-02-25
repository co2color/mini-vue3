const queue: any[] = []
const activePreFlushCbs: any = []
const p = Promise.resolve()
let isFlushPending = false
export function nextTick(fn?) {
  return fn ? p.then(fn) : p
}
function queueFlush() {
  // 如果同时触发了两个组件的更新的话
  // 这里就会触发两次 then （微任务逻辑）
  // 但是着是没有必要的
  // 我们只需要触发一次即可处理完所有的 job 调用
  // 所以需要判断一下 如果已经触发过 nextTick 了
  // 那么后面就不需要再次触发一次 nextTick 逻辑了
  if (isFlushPending) return
  isFlushPending = true
  nextTick(flushJobs)
}
export function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs)
}

function queueCb(cb, activeQueue) {
  // 直接添加到对应的列表内就ok
  // todo 这里没有考虑 activeQueue 是否已经存在 cb 的情况
  // 然后在执行 flushJobs 的时候就可以调用 activeQueue 了
  activeQueue.push(cb)

  // 然后执行队列里面所有的 job
  queueFlush()
}
