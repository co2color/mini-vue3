export const extend = Object.assign

export const isObject = (val) => val !== null && typeof val === 'object'

export function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue)
}
export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key)

// 驼峰转连字符
export function hyphenate(str: string) {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}
// 连字符转驼峰， add-foo->addFoo
export function camelize(str: string) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)
export const toHandlerKey = (str: string) => (str ? `on${capitalize(str)}` : ``)
