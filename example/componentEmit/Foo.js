import { h } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup(_props, { emit }) {
    const emitAdd = () => {
      emit('add', 1, 2)
      emit('add-foo', 1, 2)
    }
    return {
      emitAdd,
    }
  },
  render() {
    const btn = h(
      'button',
      {
        class: 'Foo-button',
        onClick: this.emitAdd,
      },
      'emitAddText'
    )
    return h(
      'div',
      {
        class: 'Foo',
      },
      [btn]
    )
  },
}
