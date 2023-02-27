export * from './runtime-core'

function instance_of(L, R) {
  let PL = L.__proto__
  let PR = R.prototype
  while (true) {
    if (PL === null) return false
    if (PL === PR) return true
    PL = PL.__proto__
  }
}
