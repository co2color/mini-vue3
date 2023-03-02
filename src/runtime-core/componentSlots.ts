export function initSlots(instance,children) {
    instance.slots = children
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