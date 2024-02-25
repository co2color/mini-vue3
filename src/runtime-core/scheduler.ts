const p = Promise.resolve()
export function nextTick(fn?) {
  return fn ? p.then(fn) : p
}
