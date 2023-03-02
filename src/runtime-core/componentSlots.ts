export function initSlots(instance, children) {
  normalizeObjectSlots(children, instance.slots)

  // const { vnode: { shapeFlag } } = instance
  // if (shapeFlag & 32 /* SLOTS_CHILDREN */) {
  //     instance.slots = children
  // } else {
  //     instance.slots = {}
  //     if (children) {
  //     for (let i = 0; i < children.length; i++) {
  //         const child = children[i]
  //         const { name } = child.props
  //         if (name) {
  //         instance.slots[name] = child
  //         }
  //     }
  //     }
  // }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value]
}

function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key]
    slots[key] = normalizeSlotValue(value)
  }
}
