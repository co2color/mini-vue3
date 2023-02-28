export const extend = Object.assign

export const isObject = (val) => val !== null && typeof val === 'object'

export function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue)
}
export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)