const queue: any[] = [];
const activePreFlushCbs: any = [];
const p = Promise.resolve()
export function nextTick(fn?) {
  return fn ? p.then(fn) : p
}
